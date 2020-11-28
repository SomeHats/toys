use crate::dom;
use futures::future;
use futures::future::{FutureExt, LocalBoxFuture};
use serde::Serialize;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

enum Anim {
    Web(web_sys::Animation),
    Concurrent(Vec<Animation>),
}

impl Anim {
    async fn play(self) {
        match self {
            Anim::Web(animation) => {
                let finish_promise = animation.finished().unwrap();
                animation.play().unwrap();
                wasm_bindgen_futures::JsFuture::from(finish_promise)
                    .await
                    .unwrap();
            }
            Anim::Concurrent(animations) => play_concurrent(animations).await,
        }

        fn play_concurrent<'a>(animations: Vec<Animation>) -> LocalBoxFuture<'a, ()> {
            async move {
                future::join_all(animations.into_iter().map(|anim| anim.play())).await;
            }
            .boxed_local()
        }
    }
}

pub struct Animation(Anim);

impl Animation {
    pub fn concurrent(animations: Vec<Animation>) -> Self {
        Animation(Anim::Concurrent(animations))
    }

    pub async fn play(self) {
        self.0.play().await
    }

    pub fn animate<F>(element: &dom::Element, duration_ms: f64, keyframes: F) -> Self
    where
        F: Fn(KeyframeBuilder) -> KeyframeBuilder,
    {
        animate(
            element,
            duration_ms,
            JsValue::from_serde(&keyframes(KeyframeBuilder::new())).unwrap(),
        )
    }

    pub fn join(self, animation: Self) -> Self {
        match self.0 {
            Anim::Web(a) => Animation(Anim::Concurrent(vec![Animation(Anim::Web(a)), animation])),
            Anim::Concurrent(mut animations) => {
                animations.push(animation);
                Animation(Anim::Concurrent(animations))
            }
        }
    }

    pub fn and<F>(self, element: &dom::Element, duration_ms: f64, keyframes: F) -> Self
    where
        F: Fn(KeyframeBuilder) -> KeyframeBuilder,
    {
        self.join(Self::animate(element, duration_ms, keyframes))
    }
}

fn animate(element: &web_sys::Element, duration_ms: f64, keyframes: JsValue) -> Animation {
    let mut options = web_sys::KeyframeEffectOptions::new();
    options.easing("linear");
    options.fill(web_sys::FillMode::Both);
    options.duration(&JsValue::from_f64(duration_ms));
    let animation = web_sys::Animation::new_with_effect(Some(
        &web_sys::KeyframeEffect::new_with_opt_element_and_keyframes_and_keyframe_effect_options(
            Some(element),
            Some(&keyframes.dyn_into().unwrap()),
            &options,
        )
        .unwrap(),
    ))
    .unwrap();

    Animation(Anim::Web(animation))
}

#[derive(Serialize)]
pub struct KeyframeBuilder {
    #[serde(skip_serializing_if = "Option::is_none")]
    opacity: Option<(f64, f64)>,
    #[serde(skip_serializing_if = "Option::is_none")]
    transform: Option<(String, String)>,
}

impl KeyframeBuilder {
    fn new() -> Self {
        KeyframeBuilder {
            opacity: None,
            transform: None,
        }
    }
    pub fn opacity(self, from: f64, to: f64) -> Self {
        Self {
            opacity: Some((from, to)),
            transform: self.transform,
        }
    }

    fn transform(self, from: String, to: String) -> Self {
        Self {
            transform: Some(match self.transform {
                Some((existing_from, existing_to)) => (
                    format!("{} {}", existing_from, from),
                    format!("{} {}", existing_to, to),
                ),
                None => (from, to),
            }),
            opacity: self.opacity,
        }
    }

    pub fn transform_scale_x(self, from: f64, to: f64) -> Self {
        self.transform(format!("scaleX({})", from), format!("scaleX({})", to))
    }

    pub fn transform_translate_x(self, from_px: f64, to_px: f64) -> Self {
        self.transform(
            format!("translateX({}px)", from_px),
            format!("translateX({}px)", to_px),
        )
    }

    pub fn transform_translate_y(self, from_px: f64, to_px: f64) -> Self {
        self.transform(
            format!("translateY({}px)", from_px),
            format!("translateY({}px)", to_px),
        )
    }
}

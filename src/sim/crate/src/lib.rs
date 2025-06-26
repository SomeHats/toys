extern crate itertools;
extern crate js_sys;
extern crate wasm_bindgen;
extern crate web_log;
extern crate web_sys;

mod vec2;

use crate::vec2::*;
use itertools::Itertools;
use std::{f32::consts::PI, num::NonZeroU16};
use wasm_bindgen::prelude::*;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

const FRICTION: f32 = 1.0 - 0.01;
const MAX_SPEED: f32 = 0.1;
const FRIENDS: usize = 2;

#[derive(Debug)]
#[wasm_bindgen]
pub struct App {
    ctx: CanvasRenderingContext2d,
    board: Board,
    last_t: Option<f64>,
    next_id: NonZeroU16,

    add_timer: f64,
}

#[wasm_bindgen]
pub fn create(canvas: HtmlCanvasElement) -> Result<App, JsValue> {
    let w = canvas.width();
    let h = canvas.height();
    let app = App {
        ctx: canvas
            .get_context("2d")?
            .unwrap()
            .dyn_into::<web_sys::CanvasRenderingContext2d>()?,
        board: Board::new(vec2(w as f32, h as f32), 32),
        last_t: None,
        add_timer: 0.0,
        next_id: NonZeroU16::new(1).unwrap(),
    };

    Ok(app)
}

#[wasm_bindgen]
impl App {
    pub fn draw(&mut self) {
        self.ctx.clear_rect(
            0.0,
            0.0,
            self.board.world_size.x as f64,
            self.board.world_size.y as f64,
        );

        self.ctx.set_fill_style(&"black".into());
        self.ctx.set_stroke_style(&"black".into());

        // self.ctx.set_global_alpha(0.3);
        // self.ctx.begin_path();
        // for x in (0..(self.board.world_size.x as u32)).step_by(self.board.cell_size as usize) {
        //     self.ctx.move_to(x as f64 - 0.5, 0.0);
        //     self.ctx
        //         .line_to(x as f64 - 0.5, self.board.world_size.y as f64);
        // }
        // for y in (0..(self.board.world_size.y as u32)).step_by(self.board.cell_size as usize) {
        //     self.ctx.move_to(0.0, y as f64 - 0.5);
        //     self.ctx
        //         .line_to(self.board.world_size.x as f64, y as f64 - 0.5);
        // }
        // self.ctx.stroke();

        // self.ctx.set_font("8px tomThumb");
        // self.board
        //     .cells()
        //     .iter()
        //     .enumerate()
        //     .for_each(|(idx, cell)| {
        //         self.ctx
        //             .fill_text(
        //                 &format!("{:?}", idx),
        //                 1.0 + (cell.pos.x * self.board.cell_size) as f64,
        //                 8.5 + (cell.pos.y * self.board.cell_size) as f64,
        //             )
        //             .unwrap();
        //     });

        // self.ctx.set_global_alpha(1.0);
        self.ctx.begin_path();
        for cell in self.board.cells.iter() {
            for thing in cell.things.iter() {
                self.ctx.move_to(thing.pos.x as f64, thing.pos.y as f64);
                self.ctx
                    .ellipse(
                        thing.pos.x.round() as f64,
                        thing.pos.y.round() as f64,
                        2.5,
                        2.5,
                        0.0,
                        0.0,
                        2.0 * std::f64::consts::PI,
                    )
                    .unwrap();
            }
        }
        // self.ctx.set_global_alpha(1.0);
        self.ctx.fill();
    }

    pub fn update(&mut self, t: f64) {
        let dt_ms = match self.last_t {
            Some(last_t) => {
                let dt = t - last_t;
                self.last_t = Some(t);
                dt
            }
            None => {
                self.last_t = Some(t);
                return;
            }
        };

        self.add_timer += dt_ms;
        let timer = 100.0;
        if self.add_timer > timer {
            self.add_timer -= timer;
            web_log::println!("add_timer: {}", self.add_timer);

            let id = self.id();
            self.board.add(Thing {
                id,
                friends: [None; 4],
                pos: vec2(rand::random::<f32>(), rand::random()) * self.board.world_size,
                vel: (vec2(rand::random::<f32>(), rand::random()) - vec2(0.5, 0.5)) * 0.4,
            });
        }

        self.board.update(dt_ms as f32);
    }

    fn id(&mut self) -> NonZeroU16 {
        let id = self.next_id;
        self.next_id = NonZeroU16::new(id.get() + 1).unwrap();
        id
    }
}

#[derive(Debug)]
struct Board {
    world_size: Vec2<f32>,
    grid_size: Vec2<u32>,
    cell_size: u32,

    cells: Vec<Cell>,
}
impl Board {
    fn new(world_size: Vec2<f32>, cell_size: u32) -> Self {
        let grid_size = (world_size / (cell_size as f32))
            .map(f32::ceil)
            .map(|x| x as u32);

        let cell_count = grid_size.x * grid_size.y;

        let cells: Vec<_> = (0..cell_count)
            .map(|i| Cell {
                pos: vec2(i % grid_size.x, i / grid_size.x),
                things: vec![],
            })
            .collect();

        Board {
            world_size,
            grid_size,
            cell_size,
            cells,
        }
    }

    fn world_to_grid(&self, pos: Vec2<f32>) -> Vec2<u32> {
        pos.map(|x| (x as u32 / self.cell_size))
    }
    fn _grid_to_world(&self, pos: Vec2<u32>) -> Vec2<f32> {
        pos.map(|x| (x * self.cell_size) as f32)
    }
    fn grid_to_index(&self, pos: Vec2<u32>) -> usize {
        (pos.y * self.grid_size.x + pos.x) as usize
    }
    fn _index_to_grid(&self, index: usize) -> Vec2<u32> {
        vec2(
            index as u32 % self.grid_size.x,
            index as u32 / self.grid_size.x,
        )
    }

    fn add(&mut self, mut thing: Thing) {
        thing.pos.x = thing.pos.x.wrap(0.0, self.world_size.x);
        thing.pos.y = thing.pos.y.wrap(0.0, self.world_size.y);

        let grid_pos = self.world_to_grid(thing.pos);
        let cell_idx = self.grid_to_index(grid_pos);

        // web_log::println!(
        //     "grid_pos: {:?}; cell_idx: {:?}; board: {:?}",
        //     grid_pos,
        //     cell_idx,
        //     &self
        // );
        self.cells[cell_idx].things.push(thing);
    }

    fn update(&mut self, dt: f32) {
        let (cells, things_to_place): (Vec<_>, Vec<_>) =
            self.cells.iter().map(|cell| cell.update(dt, &self)).unzip();

        let total_things: usize = cells.iter().map(|cell| cell.things.len()).sum();

        self.cells = cells;
        let mut relocate_count = 0;
        for things in things_to_place {
            for thing in things {
                relocate_count += 1;
                self.add(thing);
            }
        }

        if relocate_count > 0 {
            web_log::println!(
                "relocated {} things ({:2}%)",
                relocate_count,
                relocate_count as f32 / total_things as f32 * 100.0
            );
        }
    }

    fn iter_neighbours_and_self(&self, grid_pos: Vec2<u32>) -> impl Iterator<Item = &Cell> {
        let x_range = grid_pos.x.saturating_sub(1)..=grid_pos.x.saturating_add(1);
        let y_range = grid_pos.y.saturating_sub(1)..=grid_pos.y.saturating_add(1);

        x_range
            .flat_map(move |x| y_range.clone().map(move |y| vec2(x, y)))
            .filter(move |pos| pos.x < self.grid_size.x && pos.y < self.grid_size.y)
            .map(move |pos| &self.cells[self.grid_to_index(pos)])
    }

    fn find_nearby(&self, target: &Thing, range: f32) -> impl Iterator<Item = ThingRelation> {
        // we limit the range to cell_size, as we never want to search more than one cell away
        assert!(range <= self.cell_size as f32);

        let target_pos = target.pos;
        let target_id = target.id;

        let range_sq = range * range;
        let grid_pos = self.world_to_grid(target.pos);
        self.iter_neighbours_and_self(grid_pos)
            .map(|cell| cell.things.iter())
            .flatten()
            .filter_map(move |thing| {
                if thing.id == target_id {
                    return None;
                }

                let delta = thing.pos - target_pos;
                let dist_sq = delta.length_sq();
                if dist_sq > range_sq {
                    return None;
                }

                return Some(ThingRelation {
                    thing,
                    dist: dist_sq.sqrt(),
                    dir: delta.normalize(),
                });
            })
    }
}

#[derive(Debug, Clone)]
struct Cell {
    pos: Vec2<u32>,
    things: Vec<Thing>,
}
impl Cell {
    fn update(&self, dt: f32, world: &Board) -> (Self, Vec<Thing>) {
        let (next_things, other_things) = self
            .things
            .iter()
            .map(|thing| {
                let mut cloned = thing.clone();
                cloned.update_in_place(dt, world);
                cloned
            })
            .partition(|thing| {
                let grid_pos = world.world_to_grid(thing.pos);
                grid_pos == self.pos
            });

        let next_self = Cell {
            pos: self.pos,
            things: next_things,
        };

        (next_self, other_things)
    }
}

#[derive(Debug, Clone)]
struct ThingRelation<'a> {
    thing: &'a Thing,
    dist: f32,
    dir: Vec2<f32>,
}

#[derive(Debug, Clone)]
struct Thing {
    id: NonZeroU16,
    pos: Vec2<f32>,
    vel: Vec2<f32>,
    friends: [Option<NonZeroU16>; 4],
}
impl Thing {
    fn update_in_place(&mut self, dt: f32, board: &Board) {
        self.apply_forces_away_from_wall(board.world_size, dt);

        let max_friend_distance = 16.0;
        let (others_a, others_b) = board.find_nearby(self, 16.0).tee();

        const ARRAY_REPEAT_VALUE: Option<ThingRelation<'_>> = None;
        let mut friends: [Option<ThingRelation>; FRIENDS] = [ARRAY_REPEAT_VALUE; FRIENDS];
        let mut friend_count = 0;

        fn is_mutual_friend(a: &Thing, b: &Thing) -> bool {
            a.friends.iter().any(|f| f == &Some(b.id))
        }

        for other in others_a {
            self.apply_force_away(&other, 8.0, 0.001, dt);
            if self.friends.contains(&Some(other.thing.id))
                && other.dist < max_friend_distance
                && is_mutual_friend(&self, other.thing)
            {
                friends[friend_count] = Some(other.clone());
                friend_count += 1;
            }
        }

        let potential_new_friends = others_b
            .filter(|other| {
                friends
                    .iter()
                    .flatten()
                    .all(|f| f.thing.id != other.thing.id)
            })
            .k_smallest_by(2, |a, b| a.dist.partial_cmp(&b.dist).unwrap());

        let new_friends = friends
            .iter()
            .flatten()
            .cloned()
            .chain(potential_new_friends)
            .collect_vec();

        for other in new_friends.iter() {
            self.apply_force_towards(&other, 8.0, 16.0, 0.003, dt);
        }

        self.vel = self.vel * FRICTION;
        if self.vel.length() > MAX_SPEED {
            self.vel = self.vel.normalize() * MAX_SPEED;
        }

        self.pos = self.pos + self.vel * dt;
    }

    fn apply_force_away(
        &mut self,
        target: &ThingRelation,
        target_dist: f32,
        amt_away: f32,
        dt: f32,
    ) {
        if target.dist > target_dist {
            return;
        }

        let force_multiplier = target.dist.map_range(0.0, target_dist, 1.0, 0.0).sqrt();
        let force = target.dir * force_multiplier * dt * amt_away;
        self.vel = self.vel - force;
    }

    fn apply_force_towards(
        &mut self,
        target: &ThingRelation,
        target_dist: f32,
        max_dist: f32,
        amt_towards: f32,
        dt: f32,
    ) {
        if target.dist > max_dist || target.dist < target_dist {
            return;
        }

        let force_multiplier = target
            .dist
            .map_range(target_dist, max_dist, 0.0, PI)
            .sin()
            .powi(2);
        let force = target.dir * force_multiplier * dt * amt_towards;
        self.vel = self.vel + force;
    }

    fn apply_forces_away_from_wall(&mut self, world_size: Vec2<f32>, dt: f32) {
        let wall_force_dist = 6.0;
        let wall_force_amt = 0.1;
        let mut force = vec2(0.0, 0.0);

        force.x += self
            .pos
            .x
            .map_range_clamped(0.0, wall_force_dist, wall_force_amt, 0.0);
        force.x -= self.pos.x.map_range_clamped(
            world_size.x - wall_force_dist,
            world_size.x,
            0.0,
            wall_force_amt,
        );
        force.y += self
            .pos
            .y
            .map_range_clamped(0.0, wall_force_dist, wall_force_amt, 0.0);
        force.y -= self.pos.y.map_range_clamped(
            world_size.y - wall_force_dist,
            world_size.y,
            0.0,
            wall_force_amt,
        );

        self.vel = self.vel + force * dt;
    }
}

trait NumExt {
    fn wrap(self, min: Self, max: Self) -> Self;
    // fn lerp(self, target: Self, amt: f32) -> Self;
    // fn ilerp(self, min: Self, max: Self) -> f32;
    fn map_range(self, min: Self, max: Self, new_min: Self, new_max: Self) -> Self;
    fn map_range_clamped(self, min: Self, max: Self, new_min: Self, new_max: Self) -> Self;
}
impl NumExt for f32 {
    fn wrap(self, min: f32, max: f32) -> f32 {
        (self - min).rem_euclid(max - min) + min
    }
    // fn lerp(self, target: f32, amt: f32) -> f32 {
    //     self + (target - self) * amt
    // }
    // fn ilerp(self, min: f32, max: f32) -> f32 {
    //     (self - min) / (max - min)
    // }
    fn map_range(self, min: f32, max: f32, new_min: f32, new_max: f32) -> f32 {
        new_min + (self - min) * (new_max - new_min) / (max - min)
    }
    fn map_range_clamped(self, min: f32, max: f32, new_min: f32, new_max: f32) -> f32 {
        let (a, b) = (new_min.min(new_max), new_max.max(new_min));
        (new_min + (self - min) * (new_max - new_min) / (max - min)).clamp(a, b)
    }
}

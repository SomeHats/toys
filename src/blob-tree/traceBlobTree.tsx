import { assert } from '../lib/assert';
import { DebugDraw } from '../lib/DebugDraw';
import { fakeConsole } from '../lib/fakeConsole';
import Vector2 from '../lib/geom/Vector2';
import { constrainWrapped, indexed, sortBy } from '../lib/utils';
import { BlobTree, BlobTreeNode } from './BlobTree';

// interface TracerInterface {
//   moveTo(x: number, y: number);
//   quadraticCurveTo(cpx: number, cpy: number, x: number, y: number);
// }

const TENSION = 0.2;

export function traceBlobTree(
  blobTree: BlobTree,
  debugDraw: DebugDraw,
  console = fakeConsole,
) {
  for (const rootNode of blobTree.iterateRootNodes()) {
    traceBlobTreeRoot(blobTree, rootNode, debugDraw, console);
  }
}

export function traceBlobTreeRoot(
  tree: BlobTree,
  root: BlobTreeNode,
  debugDraw: DebugDraw,
  console = fakeConsole,
) {
  const prevNode = root;
  const node: BlobTreeNode | undefined = Array.from(
    tree.iterateChildNodes(root),
  )[0];
  const nextNode = node
    ? Array.from(tree.iterateChildNodes(node))[0]
    : undefined;

  if (!prevNode || !node || !nextNode) {
    return;
  }

  const prevCircle = prevNode.toCircle();
  const circle = node.toCircle();
  const nextCircle = nextNode.toCircle();

  const prevTangents = prevCircle.outerTangentsWith(circle);
  const nextTangents = circle.outerTangentsWith(nextCircle);

  if (!prevTangents || !nextTangents) {
    return;
  }

  const incomingTangentAtNode = prevTangents[0];
  const outgoingTangentAtNode = nextTangents[0];
  debugDraw.debugLine2(incomingTangentAtNode, { color: 'lime' });
  debugDraw.debugLine2(outgoingTangentAtNode, { color: 'lime' });
  const tangentIntersection = incomingTangentAtNode.pointAtIntersectionWith(
    outgoingTangentAtNode,
  );
  const connectionNormal = circle.center.angleTo(tangentIntersection);
  const connectionPoint =
    incomingTangentAtNode.isPointWithinBounds(tangentIntersection) &&
    outgoingTangentAtNode.isPointWithinBounds(tangentIntersection)
      ? tangentIntersection
      : circle.pointOnCircumference(connectionNormal);

  debugDraw.debugPointX(connectionPoint);

  const startPoint = incomingTangentAtNode.start;
  const endPoint = connectionPoint;
  const startDerivative = incomingTangentAtNode.start
    .lerp(incomingTangentAtNode.end, TENSION)
    .sub(startPoint);
  const endDerivative = Vector2.fromPolar(
    connectionNormal + Math.PI / 2,
    incomingTangentAtNode.length * TENSION,
  );
  debugDraw.debugVectorAtPoint(startDerivative, startPoint);
  debugDraw.debugVectorAtPoint(endDerivative, endPoint);

  debugDraw.debugBezierCurve(
    startPoint,
    startPoint.add(startDerivative),
    endPoint.sub(endDerivative),
    endPoint,
  );
}

// export function traceBlobTreeRoot(
//   tree: BlobTree,
//   root: BlobTreeNode,
//   debugDraw: DebugDraw,
//   console = fakeConsole,
// ) {
//   console.group('traceBlobTreeRoot');
//   console.log({ tree, root });
//   function traceNode(node: BlobTreeNode, prevTangent?: Vector2) {
//     console.group('traceNode');
//     console.log({ node });
//     const nodeCircle = node.toCircle();

//     const parentNode = tree.getNodeParentIfExists(node);
//     const parentAngle = parentNode
//       ? node.position.angleTo(parentNode.position)
//       : 0;
//     const children = sortBy(Array.from(tree.iterateChildNodes(node)), (child) =>
//       constrainWrapped(
//         0,
//         Math.PI * 2,
//         node.position.angleTo(child.position) - parentAngle,
//       ),
//     );

//     let last = parentNode;
//     let incomingTangent = prevTangent;
//     for (const [index, child] of indexed(children)) {
//       const childTangents = nodeCircle.outerTangentsWith(child.toCircle());
//       if (!childTangents) continue;
//       debugDraw.debugPolyLine([childTangents[0].start, childTangents[0].end], {
//         color: 'lime',
//         label: String(index),
//       });

//       const lastTangents = last?.toCircle().outerTangentsWith(nodeCircle);
//       console.log(lastTangents);
//       if (lastTangents) {
//         const t1 = lastTangents[0];
//         const t2 = childTangents[0];
//         const angleToLineNormal = nodeCircle.center.angleTo(
//           t1.pointAtIntersectionWith(t2),
//         );
//         const targetPoint = nodeCircle.pointOnCircumference(angleToLineNormal);
//         debugDraw.debugPointX(targetPoint);
//         const cp1 = targetPoint.add(
//           Vector2.fromPolar(angleToLineNormal - Math.PI / 2, t1.length * 0.3),
//         );
//         debugDraw.debugPointX(cp1);
//         if (prevTangent) {
//           debugDraw.debugPointX(prevTangent, { color: 'cyan' });
//         }
//       }

//       traceNode(child);
//       last = child;
//     }
//     console.groupEnd();
//   }

//   traceNode(root);
//   console.groupEnd();
// }

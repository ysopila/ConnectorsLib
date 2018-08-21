// line - [{x, y}, {x, y}]
function doesLinesIntersect(l1, l2) {
    var uA = ((l2[1].x-l2[0].x)*(l1[0].y-l2[0].y) - (l2[1].y-l2[0].y)*(l1[0].x-l2[0].x)) / ((l2[1].y-l2[0].y)*(l1[1].x-l1[0].x) - (l2[1].x-l2[0].x)*(l1[1].y-l1[0].y));
    var uB = ((l1[1].x-l1[0].x)*(l1[0].y-l2[0].y) - (l1[1].y-l1[0].y)*(l1[0].x-l2[0].x)) / ((l2[1].y-l2[0].y)*(l1[1].x-l1[0].x) - (l2[1].x-l2[0].x)*(l1[1].y-l1[0].y));
    return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}
// line - [{x, y}, {x, y}]
// rect - {x, y, width, height}
function doesLineIntersectsRect(line, rect) {
    return doesLinesIntersect(line, [{ x: rect.x, y: rect.y}, { x: rect.x + rect.width, y: rect.y }])
        || doesLinesIntersect(line, [{ x: rect.x + rect.width, y: rect.y}, { x: rect.x + rect.width, y: rect.y + rect.height }])
        || doesLinesIntersect(line, [{ x: rect.x + rect.width, y: rect.y + rect.height}, { x: rect.x, y: rect.y + rect.height }])
        || doesLinesIntersect(line, [{ x: rect.x, y: rect.y + rect.height}, { x: rect.x, y: rect.y }]);
}
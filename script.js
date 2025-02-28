const points = [];
const visibilityRange = 200;
const body = document.body;
const svg = document.getElementById("svg-container");

const initialiseLine = (startX, startY) => {
  const line = document.querySelector("#line").cloneNode(true);
  line.setAttribute("x1", startX);
  line.setAttribute("x2", startX);
  line.setAttribute("y1", startY);
  line.setAttribute("y2", startY);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "2");
  svg.appendChild(line);

  return line;
};

const addNode = (x, y) => {
  const point = document.createElement("div");
  point.classList.add("node");
  point.style.left = `${x}px`;
  point.style.top = `${y}px`;
  body.appendChild(point);

  return point;
};

const joinPoints = (line, end) => {
  line.setAttribute("x2", end.x);
  line.setAttribute("y2", end.y);
};

const getDistance = (from, to) => {
  return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
};

document.addEventListener("click", (event) => {
  const node = addNode(event.clientX, event.clientY);

  for (const point of points) {
    if (
      getDistance(point, { x: event.clientX, y: event.clientY }) <
      visibilityRange
    ) {
      joinPoints(point.lines.at(-1), {
        x: event.clientX,
        y: event.clientY,
      });
      const newLine = initialiseLine(point.x, point.y);

      point.lines.push(newLine);
    }
  }

  const line = initialiseLine(event.clientX, event.clientY);

  points.push({
    node,
    x: event.clientX,
    y: event.clientY,
    lines: [line],
  });
});

document.onmousemove = (event) => {
  for (const point of points) {
    if (
      getDistance(point, { x: event.clientX, y: event.clientY }) <
      visibilityRange
    ) {
      point.node.classList.add("visible");
      joinPoints(point.lines.at(-1), {
        x: event.clientX,
        y: event.clientY,
      });
    } else {
      point.node.classList.remove("visible");
      joinPoints(point.lines.at(-1), point);
    }
  }
};

document.onload = alert("try clicking and moving the mouse in the window..");

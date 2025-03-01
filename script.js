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
  line.classList.add("line");
  svg.appendChild(line);

  return line;
};

const placeNode = (x, y) => {
  const node = document.createElement("div");
  node.classList.add("node");
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  body.appendChild(node);

  return node;
};

const joinPoints = (line, end) => {
  line.setAttribute("x2", end.x);
  line.setAttribute("y2", end.y);
};

const getDistance = (from, to) => {
  return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
};

const placeGuideNode = (x, y) => {
  const node = placeNode(x, y);
  node.classList.add("guide-point");
  return node;
};

const clearPoints = () => {
  if (points.length === 0) return;
  const node = points.pop().node;
  body.removeChild(node);
  clearPoints();
};

const clearLines = () => {
  for (const line of svg.querySelectorAll(".line")) {
    svg.removeChild(line);
  }
};

const clearGuidNodes = (guideNodes) => {
  for (const node of guideNodes) {
    body.removeChild(node);
  }
};

const addNode = (event) => {
  const node = placeNode(event.clientX, event.clientY);

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
};

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

const enableUserMode = (event) => {
  const hitText = body.querySelector("p");
  hitText.style.display = "none";
  addNode(event);
  document.addEventListener("click", addNode);
  document.removeEventListener("click", enableUserMode);
};

const endTutorial = (guideNodes, hintText) => {
  clearPoints();
  clearLines();
  clearGuidNodes(guideNodes);
  guideNodes.clear();
  hintText.textContent =
    "now click anywhere on the screen to start creating your own shapes";
  document.addEventListener("click", enableUserMode);
};

const tutorialThirdStep = (guideNodes, hintText) => {
  const node = placeGuideNode(660, 420);
  guideNodes.add(node);
  hintText.textContent = "click on the last circle to form a triangle";

  node.onclick = () => {
    addNode({ clientX: 660, clientY: 420 });
    node.classList.remove("guide-point");
    const hint = "move the mouse away from the point to see the line break";
    hintText.textContent = hint;
    const coundown = document.createElement("p");
    body.appendChild(coundown);
    let counter = 5;
    const timerId = setInterval(() => {
      coundown.textContent = `tutorial will end in ${counter--}`;
    }, 1 * 1000);
    setTimeout(() => {
      body.removeChild(coundown);
      clearInterval(timerId);
      endTutorial(guideNodes, hintText);
    }, 6 * 1000);
  };
};

const tutorialSecondStep = (guideNodes, hintText) => {
  const node = placeGuideNode(630, 260);
  guideNodes.add(node);
  hintText.textContent = "now click on the new green circle";

  node.onclick = () => {
    addNode({ clientX: 630, clientY: 260 });
    node.classList.remove("guide-point");
    tutorialThirdStep(guideNodes, hintText);
  };
};

const tutorialFirstStep = (guideNodes) => {
  const node = placeGuideNode(500, 380);
  guideNodes.add(node);

  const hintText = body.querySelector("p");
  hintText.textContent = "click on the green circle";

  node.onclick = () => {
    addNode({ clientX: 500, clientY: 380 });
    node.classList.remove("guide-point");
    tutorialSecondStep(guideNodes, hintText);
  };
};

const initiliseTutorial = () => {
  const guideNodes = new Set();
  tutorialFirstStep(guideNodes);
};

window.onload = initiliseTutorial;

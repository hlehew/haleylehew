document.addEventListener("DOMContentLoaded", async () => {
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  try {
    const response = await fetch("content.txt");
    if (!response.ok) {
      throw new Error(`Failed to load content.txt: ${response.status}`);
    }

    const text = await response.text();
    const content = parseContent(text);

    setText("hero-title", content["Hero headline"]);
    setHTML("hero-description", content["Hero description"]);

    const primaryLinks = content["Primary links"] || [];
    if (primaryLinks[0]) setText("primary-link-1", primaryLinks[0]);
    if (primaryLinks[1]) setText("primary-link-2", primaryLinks[1]);

    const workItems = content.workItems || [];
    for (let i = 0; i < workItems.length; i += 1) {
      const item = workItems[i];
      if (item && item.tag) {
        const tagEl = document.getElementById(`work-tag-${i + 1}`);
        const titleEl = document.getElementById(`work-title-${i + 1}`);
        const bodyEl = document.getElementById(`work-body-${i + 1}`);

        if (tagEl) tagEl.textContent = item.tag;
        if (titleEl) titleEl.textContent = item.title;
        if (bodyEl) bodyEl.textContent = item.body;
      }
    }

    setText("about-heading", content["About heading"]);
    setText("about-copy-1", content["About paragraph 1"]);
    setText("about-copy-2", content["About paragraph 2"]);

    setText("contact-heading", content["Contact heading"]);
    const contactLinks = content["Contact links"] || [];
    if (contactLinks[0]) {
      const email = document.getElementById("contact-email");
      if (email) {
        email.textContent = contactLinks[0];
        email.href = `mailto:${contactLinks[0]}`;
      }
    }
    if (contactLinks[1]) {
      const linkedIn = document.getElementById("contact-linkedin");
      if (linkedIn) {
        linkedIn.textContent = "LinkedIn";
        linkedIn.href = contactLinks[1];
      }
    }
    if (contactLinks[2]) {
      const github = document.getElementById("contact-github");
      if (github) github.textContent = contactLinks[2];
    }

    if (content.Footer) {
      const footerText = document.getElementById("footer-text");
      if (footerText) footerText.textContent = content.Footer;
    }
  } catch (error) {
    console.warn("Content could not be loaded from content.txt:", error);
  }
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value) {
    el.textContent = value;
  }
}

function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el && value) {
    el.innerHTML = value;
  }
}

function parseContent(rawText) {
  const lines = rawText.split(/\r?\n/).map((line) => line.trim());
  const data = {};
  let currentKey = null;

  for (const line of lines) {
    if (!line) continue;

    if (line.endsWith(":")) {
      currentKey = line.slice(0, -1);
      data[currentKey] = [];
      continue;
    }

    if (currentKey) {
      data[currentKey].push(line);
    }
  }

  const normalized = {};
  Object.entries(data).forEach(([key, values]) => {
    normalized[key] = values.join(" ");
  });

  const workItems = [];
  const workLineKeys = ["Web design", "Product thinking", "Storytelling"];

  let inSelectedWork = false;
  let currentWork = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed === "Selected work:") {
      inSelectedWork = true;
      continue;
    }

    if (trimmed === "How I work:") {
      inSelectedWork = false;
      continue;
    }

    if (inSelectedWork) {
      if (workLineKeys.includes(trimmed)) {
        if (currentWork && currentWork.tag && currentWork.title && currentWork.body) {
          workItems.push(currentWork);
        }
        currentWork = { tag: trimmed };
      } else if (currentWork && !currentWork.title) {
        currentWork.title = trimmed;
      } else if (currentWork && !currentWork.body) {
        currentWork.body = trimmed;
      }
    }
  }

  if (currentWork && currentWork.tag && currentWork.title && currentWork.body) {
    workItems.push(currentWork);
  }

  normalized.workItems = workItems;

  normalized["Primary links"] = [
    normalized["Primary links"] && normalized["Primary links"].split(" ")[0] ? normalized["Primary links"] : "",
  ];

  const primaryLinks = [];
  const primaryLabelIndex = lines.findIndex((line) => line === "Primary links:");
  if (primaryLabelIndex !== -1) {
    for (let i = primaryLabelIndex + 1; i < lines.length; i += 1) {
      const value = lines[i].trim();
      if (!value) continue;
      if (value === "Selected work:") break;
      primaryLinks.push(value);
    }
  }
  normalized["Primary links"] = primaryLinks;

  const contactLinks = [];
  const contactLabelIndex = lines.findIndex((line) => line === "Contact links:");
  if (contactLabelIndex !== -1) {
    for (let i = contactLabelIndex + 1; i < lines.length; i += 1) {
      const value = lines[i].trim();
      if (!value) continue;
      if (value === "Footer:") break;
      contactLinks.push(value);
    }
  }
  normalized["Contact links"] = contactLinks;

  const footerIndex = lines.findIndex((line) => line === "Footer:");
  if (footerIndex !== -1) {
    normalized.Footer = lines.slice(footerIndex + 1).join(" ").trim();
  }

  return normalized;
}

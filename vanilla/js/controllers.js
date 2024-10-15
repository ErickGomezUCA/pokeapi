function setUpTabs() {
  const tabsContainer = document.querySelector(".tabs");
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));

      tabsContainer.setAttribute("show-content", tab.getAttribute("content"));
      tab.classList.add("active");
    })
  );
}

export { setUpTabs };

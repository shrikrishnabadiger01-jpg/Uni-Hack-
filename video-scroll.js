window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollTop / maxScroll;

    video.currentTime = progress * video.duration;
});
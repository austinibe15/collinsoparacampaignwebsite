
/* =========================================
   OFFICIAL CAMPAIGN VIDEO
   Reliable click-to-load playback
========================================= */

(() => {

    "use strict";

    const video = document.getElementById(
        "official-campaign-video"
    );

    const playButton = document.getElementById(
        "campaign-video-play"
    );

    const status = document.getElementById(
        "campaign-video-status"
    );

    if (!video || !playButton) {
        console.error("Campaign video elements were not found.");
        return;
    }

    const videoSource =
        "../assets/video/official-campaign-video.mp4";

    let sourceLoaded = false;
    let loading = false;

    /* VIDEO SETTINGS */

    video.controls = true;
    video.preload = "none";
    video.playsInline = true;

    /* LOAD VIDEO */

    function loadVideo() {

        if (sourceLoaded) return;

        sourceLoaded = true;
        loading = true;

        video.src = videoSource;

        video.load();

        if (status) {
            status.textContent = "Loading campaign video...";
        }

    }

    /* PLAY VIDEO WHEN READY */

    async function startPlayback() {

        if (loading) return;

        if (!sourceLoaded) {
            loadVideo();
        }

        playButton.hidden = true;

        if (status) {
            status.textContent =
                "Preparing your campaign video...";
        }

        try {

            if (video.readyState < 2) {

                await new Promise((resolve, reject) => {

                    const onReady = () => {
                        cleanup();
                        resolve();
                    };

                    const onError = () => {
                        cleanup();
                        reject(
                            new Error("Video loading failed.")
                        );
                    };

                    const cleanup = () => {
                        video.removeEventListener(
                            "loadeddata",
                            onReady
                        );

                        video.removeEventListener(
                            "error",
                            onError
                        );
                    };

                    video.addEventListener(
                        "loadeddata",
                        onReady,
                        { once: true }
                    );

                    video.addEventListener(
                        "error",
                        onError,
                        { once: true }
                    );

                });

            }

            await video.play();

            if (status) {
                status.textContent =
                    "Now playing the official campaign video.";
            }

        } catch (error) {

            console.error(
                "Campaign video playback error:",
                error
            );

            playButton.hidden = false;

            if (status) {
                status.textContent =
                    "The video could not start. Please try again or check the MP4 video format.";
            }

        } finally {

            loading = false;

        }

    }

    /* PLAY BUTTON */

    playButton.addEventListener(
        "click",
        startPlayback
    );

    /* VIDEO PLAYING */

    video.addEventListener("playing", () => {

        playButton.hidden = true;

        if (status) {
            status.textContent =
                "Now playing the official campaign video.";
        }

    });

    /* VIDEO PAUSED */

    video.addEventListener("pause", () => {

        if (!video.ended && status) {
            status.textContent = "Campaign video paused.";
        }

    });

    /* VIDEO COMPLETED */

    video.addEventListener("ended", () => {

        if (status) {
            status.textContent =
                "Thank you for watching the official campaign video.";
        }

        playButton.hidden = false;

        const buttonText = playButton.querySelector(
            "span:last-child"
        );

        if (buttonText) {
            buttonText.textContent = "Replay Campaign Video";
        }

    });

    /* VIDEO ERROR */

    video.addEventListener("error", () => {

        console.error(
            "Video error:",
            video.error
        );

        loading = false;
        playButton.hidden = false;

        if (status) {
            status.textContent =
                "The video could not be loaded. Check the MP4 file and its video encoding.";
        }

    });

    /* VIDEO METADATA */

    video.addEventListener("loadedmetadata", () => {

        console.log(
            "Campaign video dimensions:",
            video.videoWidth,
            "x",
            video.videoHeight
        );

    });

})();
const getOverlay = (): HTMLDivElement => {
    const previewWrapper = document.querySelector("#storybook-preview-wrapper");
    if (!previewWrapper) {
        throw new Error("Storybook preview wrapper not found.");
    }

    let overlay = previewWrapper.querySelector<HTMLDivElement>(
        "#storybook-zeplin-preview",
    );
    if (!overlay) {
        const imageContainer = document.createElement("div");
        imageContainer.id = "storybook-zeplin-preview";
        previewWrapper.appendChild(imageContainer);
        overlay = imageContainer;
    }

    return overlay;
};

export { getOverlay };

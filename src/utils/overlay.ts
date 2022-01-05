const getOverlay: () => HTMLDivElement = () => {
    const previewWrapper = document.querySelector('#storybook-preview-wrapper');
    let overlay = previewWrapper.querySelector('#storybook-zeplin-preview') as HTMLDivElement;

    // Make sure overlay always returns something
    if (!overlay) {
        const imageContainer = document.createElement('div');
        imageContainer.id = "storybook-zeplin-preview";
        previewWrapper.appendChild(imageContainer);
        overlay = imageContainer;
    }

    return overlay;
}

export { getOverlay };

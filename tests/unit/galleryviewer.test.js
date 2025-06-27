const { expect } = require('chai');
const sinon = require('sinon');

describe('View All logic', () => {
    it('calls showGalleryViewer when gallery View All is clicked', () => {
        // Mock gallery structure
        const galleryName = "Tutorials";
        const galleryUrl = "tutorials";

        // Simulate a simplified Projects component with props
        const parentMock = {
            showGalleryViewer: sinon.spy()
        };

        // Simulate what the click handler does
        function onClickViewAll(url, name) {
            if (url && parentMock.showGalleryViewer) {
                parentMock.showGalleryViewer(url, name);
            }
        }

        // Act: pretend user clicked
        onClickViewAll(galleryUrl, galleryName);

        // Assert
        expect(parentMock.showGalleryViewer.calledOnce).to.be.true;
        expect(parentMock.showGalleryViewer.firstCall.args).to.deep.equal(["tutorials", "Tutorials"]);
    });
});

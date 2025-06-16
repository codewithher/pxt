import * as React from "react";
import * as data from "./data";
import * as sui from "./sui";
import * as core from "./core";
import * as codecard from "./codecard";

import { SearchInput } from "./components/searchInput";
import { fireClickOnEnter } from "./util";

import ISettingsProps = pxt.editor.ISettingsProps;
import { applyCodeCardAction } from "./projects";

export interface GalleryViewerDialogProps extends ISettingsProps {
    onClose?: () => void;
}

export interface GalleryViewerDialogState {
    visible?: boolean;
    galleryCards?: pxt.CodeCard[];
    searchFor?: string;
    galleryName?: string;
    galleryPath?: string;
}

export class GalleryViewerDialog extends data.Component<GalleryViewerDialogProps, GalleryViewerDialogState> {
    constructor(props: GalleryViewerDialogProps) {
        super(props);
        this.state = {
            visible: false,
            galleryCards: [],
            galleryName: "",
            galleryPath: ""
        };

        this.close = this.close.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    hide() {
        this.setState({ visible: false, searchFor: undefined });
    }

    close() {
        this.setState({ visible: false, searchFor: undefined });
        if (this.props.onClose) this.props.onClose();
    }

    show(galleryPath: string, galleryName: string) {
        this.setState({
            visible: true,
            galleryPath: galleryPath,
            galleryName: galleryName,
            galleryCards: []  // Clear previous gallery cards
        }, () => {
            this.fetchGalleryData();
        });
    }

    fetchGalleryData() {
        const { galleryPath } = this.state;
        if (!galleryPath) return;

        // Fetch gallery cards
        let res = this.getData(`gallery:${encodeURIComponent(galleryPath)}`) as pxt.gallery.Gallery[];
        if (res && !(res instanceof Error)) {
            this.setState({
                galleryCards: pxt.Util.concat(res.map(g => g.cards))
            });
        } else {
            // Handle error
            this.setState({
                galleryCards: []
            });
        }
    }

    handleCardClick(e: any, scr: pxt.CodeCard) {
        pxt.tickEvent("galleryviewer.card", { name: scr.name, cardType: scr.cardType });

        // Use the same application method as the regular gallery
        applyCodeCardAction(this.props.parent, "projects", scr);

        // Close the dialog after selection
        this.close();
    }

    handleSearch(inputValue: string) {
        const searchFor = (inputValue || '').trim().toLowerCase();
        this.setState({ searchFor });
    }

    renderCore() {
        const { visible, galleryCards, searchFor, galleryName } = this.state;
        if (!visible) return <div />;

        // Filter gallery cards based on search term if provided
        const filteredCards = searchFor && galleryCards ?
            galleryCards.filter(card =>
                (card.name || "").toLowerCase().indexOf(searchFor) !== -1 ||
                (card.description || "").toLowerCase().indexOf(searchFor) !== -1
            ) :
            galleryCards || [];

        return (
            <sui.Modal isOpen={visible} className="galleryviewer" size="large"
                onClose={this.close} dimmer={true}
                closeIcon={true} header={lf("All {0}", galleryName)}
                closeOnDimmerClick closeOnDocumentClick closeOnEscape>
                <div className="ui">
                    <div className="ui small fluid icon input searchdialog">
                        <SearchInput defaultValue={searchFor} placeholder={lf("Search...")} searchHandler={this.handleSearch} autoFocus={true} />
                    </div>
                    {filteredCards.length === 0 ?
                        <div className="ui segment">
                            {searchFor ? lf("No matching tutorials found.") : lf("No tutorials found.")}
                        </div> :
                        <div className="ui cards centered gallery-cards">
                            {filteredCards.map((card, index) =>
                                <codecard.CodeCardView
                                    key={card.name || card.url || index}
                                    name={card.name}
                                    ariaLabel={card.name}
                                    description={card.description}
                                    imageUrl={card.imageUrl}
                                    youTubeId={card.youTubeId}
                                    label={card.label}
                                    labelClass={card.labelClass}
                                    tags={card.tags}
                                    onClick={(e) => this.handleCardClick(e, card)}
                                />
                            )}
                        </div>
                    }
                </div>
            </sui.Modal>
        );
    }
}

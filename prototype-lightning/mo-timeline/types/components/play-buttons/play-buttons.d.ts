import { JSXElement } from '@babel/types';
export declare class PlayButtons {
    disablePlayButton: boolean;
    playing: boolean;
    private forwardClicked;
    private backClicked;
    private playPauseClicked;
    onpPlayingChange(newVal: any): void;
    render(): JSXElement;
    private handleBackClick;
    private handlePlayPauseClick;
    private handleForwardClick;
}

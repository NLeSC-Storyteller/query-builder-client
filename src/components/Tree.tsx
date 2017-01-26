import * as React                         from 'react';
import { connect }                        from 'react-redux';
import { Dispatch }                       from 'react-redux';

import { childrenRequestedThunk }         from '../actions';
import { collapseFolderWasClicked }       from '../actions';
import { expandFolderWasClicked }         from '../actions';
import { toggleFileSelectedWasClicked }   from '../actions';
import { toggleFolderSelectedWasClicked } from '../actions';
import { FolderContents }                 from '../components';
import { GenericCollectionAction }        from '../types';

export class UnconnectedTree extends React.Component<any, any> {

    constructor() {
        super();
    }

    render(): JSX.Element {
        const dbidRoot = -1;
        const { entities, onClickFolder, onClickFile, onClickCheckbox } = this.props;
        return (
            <FolderContents
                key={dbidRoot}
                dbid={dbidRoot}
                entities={entities}
                onClickFolder={onClickFolder}
                onClickFile={onClickFile}
                onClickCheckbox={onClickCheckbox}
            />
        );
    }
}

const mapStateToProps = (state: any, ownProps: any) => {

    const { collection } = ownProps;
    return {
        entities: state[collection]
    };
};

const mapDispatchToProps = (dispatch: Dispatch<GenericCollectionAction>, ownProps: any) => {

    const { collection } = ownProps;

    const onClickFolder = (dbid: number, expanded: boolean, hasChildren: boolean) => {
        if (expanded) {
            dispatch(collapseFolderWasClicked(collection, dbid));
        } else {
            if (hasChildren) {
                dispatch(expandFolderWasClicked(collection, dbid));
            } else {
                dispatch(childrenRequestedThunk(collection, dbid));
            }
        }
    };

    const onClickFile = (dbid: number) => {
        dispatch(toggleFileSelectedWasClicked(collection, dbid));
    };

    const onClickCheckbox = (dbid: number) => {
        dispatch(toggleFolderSelectedWasClicked(collection, dbid));
    };

    return {
        onClickFolder,
        onClickFile,
        onClickCheckbox
    };
};

export const Tree = connect(mapStateToProps, mapDispatchToProps)(UnconnectedTree);

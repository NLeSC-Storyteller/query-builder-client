import * as React                   from 'react';
import { connect }                  from 'react-redux';
import { Dispatch }                 from 'redux';

import { IGenericAction }           from '../actions';
import { expandButtonWasClicked }   from '../actions';
import { selectionWasClicked }      from '../actions';
import { childrenRequestedThunk }   from '../actions';

import Checkbox                     from '../Checkbox/Checkbox';
import { Button, Cell, Grid }       from 'react-mdl';

import { IStore }                   from '../interfaces';
import { SelectionState }           from '../interfaces';

import './node.css';

interface IExtraProps {
    nodeID: number;
}

export interface INode {
    parent: number;
    id: number;
    isinstance: boolean;
    level: number;
    mentioncount: number;
    name: string;
    isexpanded: boolean;
    selectionState: SelectionState;
    children: number[];
}

interface INodeDispatchProps {
    onClickExpand: (id: number) => void;
    fetchChildren: (id: number) => void;
    toggleSelection: (id: number) => void;
}

export class UnconnectedNode extends React.Component<IExtraProps & INode & INodeDispatchProps, {}> {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
        this.onClickSelect = this.onClickSelect.bind(this);
    }

    static mapStateToProps(state: IStore, ownProps: IExtraProps) {
        const dbid = ownProps.nodeID;

        if (state.nodes[dbid] === undefined) {
            return {
                nodeID: dbid,

                parent: 1,
                id: dbid,
                isinstance: false,
                level: 0,
                mentioncount: 0,
                name: 'undefined',
                isexpanded: false,
                selectionState: SelectionState.Unselected,
                children: []
            };
        } else {
            return {
                nodeID: dbid,

                parent: state.nodes[dbid].childof,
                id: state.nodes[dbid].id,
                isinstance: state.nodes[dbid].isinstance,
                level: state.nodes[dbid].level,
                mentioncount: state.nodes[dbid].mentioncount,
                name: state.nodes[dbid].name,
                isexpanded: state.nodes[dbid].isexpanded,
                selectionState: state.nodes[dbid].selectionState,
                children: state.nodes[dbid].children
            };
        }
    }

    static mapDispatchToProps(dispatch: Dispatch<IGenericAction>) {
        return {
            onClickExpand: (id: number) => {
                dispatch(expandButtonWasClicked(id));
            },
            fetchChildren: (id: number) => {
                dispatch(childrenRequestedThunk(id));
            },
            toggleSelection: (id: number) => {
                dispatch(selectionWasClicked(id));
            }
        };
    }

    public onClick() {
        this.props.fetchChildren(this.props.id);
        this.props.onClickExpand(this.props.id);
    }

    public onClickSelect() {
        this.props.toggleSelection(this.props.id);
    }

    render() {
        if (this.props.isinstance) {
            return (
                <Cell col={2}>
                    <Button raised accent={this.props.selectionState === SelectionState.Selected} onClick={this.onClickSelect}>
                        {this.props.name}
                    </Button>
                </Cell>
            );
        } else {
            if (this.props.isexpanded) {
                let childNodes: JSX.Element[] = [];
                if (this.props.children !== undefined) {
                    const temp: number[] = this.props.children;
                    childNodes = temp.map((child: number) =>
                        <Node key={child} nodeID={child} />// tslint:disable-line
                    );
                }
                return (
                    <Grid className={'mdl-cell--12-col category'}>
                        <Cell col={12} className="categoryTitleBar" onClick={this.onClick}>
                            <span className="categoryText">
                                {this.props.name}
                            </span>
                            <span>
                                <Checkbox
                                    id={'checkbox-node_' + this.props.id}
                                    ripple={true}
                                    indeterminate={this.props.selectionState === SelectionState.Partial}
                                    checked={this.props.selectionState === SelectionState.Selected}
                                    onClick={this.onClickSelect}
                                />
                            </span>
                        </Cell>
                        {childNodes}
                    </Grid>
                );
            } else {
                return (
                    <Grid className={'mdl-cell--12-col category'}>
                        <Cell col={12} className="categoryTitleBar" onClick={this.onClick}>
                            <span className="categoryText">
                                {this.props.name}
                            </span>
                            <span>
                                <Checkbox
                                    id={'checkbox-node_' + this.props.id}
                                    ripple={true}
                                    indeterminate={this.props.selectionState === SelectionState.Partial}
                                    checked={this.props.selectionState === SelectionState.Selected}
                                    onClick={this.onClickSelect}
                                />
                            </span>
                        </Cell>
                    </Grid>
                );
            }
        }
    }
}

// Export just the connected component
export const Node = connect(UnconnectedNode.mapStateToProps,
                            UnconnectedNode.mapDispatchToProps)(UnconnectedNode);

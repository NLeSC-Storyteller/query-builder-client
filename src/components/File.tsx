import * as React                   from 'react';
import { Button }                   from 'react-mdl';

import '../../node_modules/react-mdl/extra/material.css';
import '../../node_modules/react-mdl/extra/material.js';

export class File extends React.Component<any, any> {
    constructor() {
        super();
        this.onClickFile = this.onClickFile.bind(this);
    }

    onClickFile() {
        this.props.methods.onClickFile(this.props.dbid);
    }

    render(): JSX.Element {
        const myProps = this.props.state[this.props.dbid];
        const {name} = myProps;

        return (
            <Button onClick={this.onClickFile}>
                {name}
            </Button>
        );
    }
}
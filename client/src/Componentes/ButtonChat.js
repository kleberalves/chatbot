import React from 'react';
export default class ButtonChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    onClick(){
        this.props.onClick(this.props.label);
    }
    render() {
        return (            
                <button className="btnChat show" onClick={this.onClick.bind(this)}>{this.props.label}</button>
            );
    }
}
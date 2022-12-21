import React from 'react';
import loader from '../Imagens/loading.svg'

export default class LoadingBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="loading">
                <img src={loader} alt="Loading" />
            </div>
        );
    }
}


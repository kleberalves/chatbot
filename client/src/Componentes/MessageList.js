import React from 'react';
import LoadingBox from './LoadingBox';
import ButtonChat from './ButtonChat';
import parse from 'html-react-parser';

export default class MessageList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
        };

    }

    getOpacity(items, idx) {
        if (idx === items.length - 1) {
            return 1;
        } else if (idx === items.length - 2) {
            return 0.75;
        } else if (idx === items.length - 3) {
            return 0.50
        } else if (idx === items.length - 4) {
            return 0.25
        } else {
            return 0;
        }
    }

    getRandom(items, idx) {
        if (idx === items.length - 1) {
            return 0;
        } else {
            let rdm = Math.random() * 30;
            rdm = rdm < 20 ? 20 : rdm;
            if (idx % 2) {
                return rdm * -1;
            } else {
                return rdm;
            }
        }
    }

    checkHTML(txt) {
        if (txt.indexOf("http") > -1) {
            let lastChar = txt.substr(txt.length - 1, 1);
            if (lastChar === "." || lastChar === ";") {
                //pega a string excluindo o último caractere.
                txt = txt.substr(0, txt.length - 1);
            }
            let lst = txt.split("/");
            let display = `${lst[2]}${lst.length > 3 ? '/' + lst[lst.length - 1] : ""}`;
            console.log(lst);
            return parse(`<a href='${txt}' target='_blank'>${display}</a>`);

        } else if (txt.indexOf("whatsapp:") > -1) {

            let display = txt.substr(txt.lastIndexOf("abid=") + 5, txt.length);
            return parse(`<a href='${txt}' target='_blank'>${display}</a>`);

        } else if (txt.indexOf("mailto:") > -1) {

            let display = txt.substr(7, txt.length);
            return parse(`<a href='${txt}' target='_blank'>${display}</a>`);

        } else {
            return txt;
        }
    }

    render() {
        return (
            <div className="content">
                {this.props.dataSource && this.props.dataSource.map((item, idx) => {
                    const valor = this.getOpacity(this.props.dataSource, idx);
                    return (<div key={idx} style={{
                        opacity: valor,
                        transform: 'scale(' + valor + ')',
                        marginTop: this.getRandom(this.props.dataSource, idx) + 'vh'
                    }} className={item.position == "left" ? "textLeft" : "textRight"}>
                        <div className={item.miniImg ? "text withMiniImg" : "text"}>
                            {!item.lstText && item.text}
                            {item.lstText && item.lstText.map((txt, idxTxt) => {
                                return (txt.indexOf("<br/>") > -1 ? parse(txt) : <span key={idxTxt}>{this.checkHTML(txt)}</span>);
                            })}
                        </div>
                        {item.miniImg && <div className="miniImg miniImgBack" style={{ backgroundImage: 'url(' + item.miniImg + ')' }}></div>}
                        {item.miniImg && <div className="miniImg" style={{ backgroundImage: 'url(' + item.miniImg + ')' }}></div>}

                        {item.buttons && <div id="btnChat" className="alignBtnChat">
                            {item.buttons.items.map((btn, idx) => {
                                return <ButtonChat key={idx} label={btn.label} onClick={this.props.onClick} />;
                            })}
                        </div>}
                    </div>)
                })}


                {this.props.loading && <LoadingBox />}



            </div>
        );
    }
}


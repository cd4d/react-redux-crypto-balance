import { React } from "react";

export default function Header(props) {
    return (
        <header className="p-3 mb-4 border-bottom">
            <div className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a href="#" className="navbar-brand">Crypto Balance React</a>
                    </div>
                    <div className="col-md-3">
                        <select className="form-select w-auto float-end me-3" name="currency" id="currency">
                            <option>
                                {props.currency}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </header>
    )
}
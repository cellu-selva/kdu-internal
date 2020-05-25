import React, { useState, useEffect } from "react";
import AppDashboard from "../dashboard/dashboard"
import DataTable from "../common/data-table";
import { toast } from "react-toastify";
import { get, post, put, deleteEntity } from "./../util/restUtil";
import { properties } from "./../properties";
import $ from "jquery";
import { validateS } from "./../util/validateUtil";
import { string, object, number } from "yup";

const validationSchema = object().shape({
    name: string()
        .required('please enter a name for the vendor'),
    area: string().required('Please enter a vendors area')
});
const entityUrl = properties.VENDORS

const Vendor = () => {

    const [items, setItems] = useState([]);
    const [item, setItem] = useState({});
    useEffect(() => {
        get(entityUrl, {
            "filter": JSON.stringify({
                "include": ["stocks"]
            })
        })
            .then((resp) => {
                resp.forEach((vend) => {
                    if (vend.stocks) {
                        vend.totalPurchase = 0;
                        vend.settled = 0;
                        vend.pending = 0;
                        vend.stocks.forEach((stock) => {
                            vend.totalPurchase += stock.totalPrice;
                            if(stock.isSettled) {
                                vend.settled += stock.totalPrice || 0;
                            } else {
                                vend.pending += stock.totalPrice;
                            }
                        })
                    }
                })
                setItems(resp)
            })
    }, [item])
    const [error, setError] = useState({});

    const editItem = (item) => {
        setItem(item);
    }

    const deleteItem = (id) => {
        deleteEntity(entityUrl + '/' + id)
            .then((resp) => {
                setItem({});
            })
    }

    const resetItem = (item) => {
        setItem({
            name: '',
            area: ''
        });
    }

    const saveItem = () => {
        const error = validateS(validationSchema, item, setError);
        if (error) return;
        let url = entityUrl
        let method = post
        if (item.id) {
            url = url + '/' + item.id
            method = put
        }
        method(url, item)
            .then((resp) => {
                setItem(resp);
                $('#vendor-modal').modal('toggle');
                toast.success("Vendor saved successfully");
            }).catch((err) => {
                toast.error("Error saving vendor");
            })
    }

    const data = {
        headers: ['name', 'area', 'totalPurchase', 'pending', 'settled'],
        values: items
    }

    return (
        <AppDashboard>
            <div
                id="vendor-modal" style={{ display: 'none' }}
                className="modal fade"
                data-backdrop="static"
                data-keyboard="false">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add/Edit Vendor</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <div className={error.name ? "error" : ""}>
                                        <label className="col-form-label">{'Name'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder={'name'}
                                            value={item.name}
                                            onChange={e => {
                                                setItem({ ...item, name: e.target.value.toUpperCase() });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.name ? <span className="error-msg">{error.name}</span> : ""}
                                    </div>
                                    <div className={error.area ? "error" : ""}>
                                        <label className="col-form-label">{'Area'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="100.00"
                                            value={item.area}
                                            onChange={e => {
                                                setItem({
                                                    ...item,
                                                    area: e.target.value.toUpperCase()
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.area ? <span className="error-msg">{error.area}</span> : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={e => {
                                resetItem();
                            }}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={e => {
                                saveItem();
                            }}>Save Product</button>
                        </div>
                    </div>
                </div>
            </div>
            <DataTable title="Vendors" data={data} isActionEnabled={true} editItem={editItem} deleteItem={deleteItem} addItem={resetItem} targetId="#vendor-modal"/>
        </AppDashboard>
    )
};

export default Vendor;

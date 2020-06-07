import React, { useState, useEffect } from "react";
import AppDashboard from "../dashboard/dashboard"
import DataTable from "../common/data-table";
import { toast } from "react-toastify";
import { get, post, put, deleteEntity } from "./../util/restUtil";
import { properties } from "./../properties";
import $ from "jquery";
import { validateS } from "./../util/validateUtil";
import { string, object, number, date } from "yup";
import { uuid } from "uuidv4";

const validationSchema = object().shape({
    saleType: string()
        .required('please enter the purchase date'),
    // totalPrice: number().required('Please enter the total sale'),
    pricePerUnit: number().required('Please enter selling price per unit'),
    productId: string().required('Please select a product'),
    saleWeight: string().required('Please enter the sale quantity/')
});
const entityUrl = properties.SALES

const Sale = () => {

    const [items, setItems] = useState([]);
    const [item, setItem] = useState({});
    const [products, setProducts] = useState([])
    const [stockSummary, setStockSummary] = useState([])

    useEffect(() => {
        Promise.all([
            get(entityUrl, { filter: JSON.stringify({ "include": ["product"] }) }),
            get(properties.PRODUCTS),
            get(properties.STOCKS_SUMMARY),
        ]).then(([saleResp, productsResp, stockSummaryResp]) => {
            setProducts(productsResp);
            saleResp.forEach(element => {
                if (element.product) {
                    element.productName = element.product.name
                }
            });
            setItems(saleResp);
            setStockSummary(stockSummaryResp);
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
            saleType: '',
            saleDate: '',
            // totalPrice: number().required('Please enter the total sale'),
            pricePerUnit: '',
            productId: '',
            saleWeight: ''
        });
    }
    
    const getStockSummaryObject = (stockSummary, oldStock, newStock, id) => {
        debugger
        stockSummary.balance = stockSummary.balance - (id ? Number(newStock.wholeWeight) - Number(oldStock.wholeWeight) : newStock.wholeWeight)
        return stockSummary;
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
        
        get(url)
            .then((resp) => {
                get(properties.STOCKS_SUMMARY, {
                    filter: JSON.stringify({
                        where: {
                            productId: item.productId
                        }
                    })
                }).then((response) => {
                    const stockSummary = response[0];
                    if (item.wholeWeight > stockSummary.balance) {
                        return toast.error('The sold quantity is more than the availabe stock');
                    }
                    method(entityUrl, item)
                    .then((saleResp) => {
                        debugger
                        put(properties.STOCKS_SUMMARY + '/' + stockSummary.id, getStockSummaryObject(stockSummary, resp, saleResp, item.id))
                        setItem(resp);
                    })
                })
                $('#sale-modal').modal('toggle');
                toast.success("Sale saved successfully");
            }).catch((err) => {
                toast.error("Error saving sale");
            })
    }

    const data = {
        headers: ['saleDate', 'productName', 'saleWeight', 'wholeWeight', 'pricePerUnit', 'totalPrice'],
        values: items
    }
debugger
    return (
        <AppDashboard>
            <div
                id="sale-modal" style={{ display: 'none' }}
                className="modal fade"
                data-backdrop="static"
                data-keyboard="false">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add/Edit Sale</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <div className={error.saleDate ? "error" : ""}>
                                        <label className="col-form-label">{'Sale Date'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="date"
                                            placeholder=""
                                            value={item.saleDate}
                                            onChange={e => {
                                                setItem({
                                                    ...item,
                                                    saleDate: e.target.value.toUpperCase()
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.saleDate ? <span className="error-msg">{error.saleDate}</span> : ""}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Product</label>
                                    <select
                                        className="form-control form-control-lg"
                                        value={item.productId}
                                        onChange={(e) => {
                                            setItem({ ...item, productId: e.target.value });
                                        }}
                                    >
                                        <option>Select</option>
                                        {!products
                                            ? ""
                                            : products.map((product, index) => {
                                                return (
                                                    <option key={uuid()} value={product.id}>
                                                        {product.name}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Sale Type</label>
                                    <select
                                        className="form-control form-control-lg"
                                        value={item.saleType}
                                        onChange={(e) => {
                                            setItem({ ...item, saleType: e.target.value });
                                        }}
                                    >
                                        <option>Select</option>
                                        <option value="walik-in">Walk in</option>
                                        <option value="online">Online</option>
                                        <option value="bulk">Whole Sale</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className={error.saleWeight ? "error" : ""}>
                                        <label className="col-form-label">{'Sold Quantity'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="number"
                                            placeholder=""
                                            value={item.saleWeight}
                                            disabled={!item.productId}
                                            onChange={e => {
                                                const index = products.findIndex((prod) => {
                                                    return prod.id === item.productId
                                                })
                                                const product = products[index]
                                                setItem({
                                                    ...item,
                                                    saleWeight: Number(e.target.value.toUpperCase()),
                                                    wholeWeight: Number(e.target.value.toUpperCase()) * (product ? product.wastagePercentage: 1)
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.saleWeight ? <span className="error-msg">{error.saleWeight}</span> : ""}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className={error.wholeWeight ? "error" : ""}>
                                        <label className="col-form-label">{'Whole Quantity'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="number"
                                            placeholder=""
                                            value={item.wholeWeight}
                                            disabled={true}
                                            onChange={e => {
                                                setItem({
                                                    ...item,
                                                    wholeWeight: e.target.value.toUpperCase()
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.wholeWeight ? <span className="error-msg">{error.wholeWeight}</span> : ""}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className={error.pricePerUnit ? "error" : ""}>
                                        <label className="col-form-label">{'Price per unit'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="number"
                                            placeholder=""
                                            value={item.pricePerUnit}
                                            disabled={!item.saleWeight}
                                            onChange={e => {
                                                setItem({
                                                    ...item,
                                                    pricePerUnit: e.target.value.toUpperCase(),
                                                    totalPrice: Number(e.target.value.toUpperCase()) * Number(item.saleWeight)
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.pricePerUnit ? <span className="error-msg">{error.pricePerUnit}</span> : ""}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className={error.totalPrice ? "error" : ""}>
                                        <label className="col-form-label">{'Total Price'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="number"
                                            placeholder=""
                                            value={item.totalPrice}
                                            disabled={true}
                                            onChange={e => {
                                                setItem({
                                                    ...item,
                                                    totalPrice: e.target.value.toUpperCase()
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.totalPrice ? <span className="error-msg">{error.totalPrice}</span> : ""}
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
            <DataTable title="Sale" data={data} isActionEnabled={true} editItem={editItem} deleteItem={deleteItem} addItem={resetItem} targetId="#sale-modal" />
        </AppDashboard>
    )
};

export default Sale;

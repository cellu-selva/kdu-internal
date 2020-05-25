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

import { formatDate } from "../util/dateUtil";
const validationSchema = object().shape({
    purchaseDate: date()
        .required('please enter the purchase date'),
    totalPrice: number().required('Please enter a purchase value'),
    pricePerUnit: number().required('Please enter a purchase value per unit'),
    measuringUnit: string().required('Please enter a measuring unit'),
    productId: string().required('Please select a product'),
    vendorId: string().required('Please select a vendor'),
});
const entityUrl = properties.STOCKS

const Stock = () => {

    const [items, setItems] = useState([]);
    const [item, setItem] = useState({});
    const [products, setProducts] = useState([])
    const [vendors, setVendors] = useState([])

    useEffect(() => {
        Promise.all([
            get(entityUrl, { filter: JSON.stringify({ "order": "purchaseDate desc", "include": ["product"] }) }),
            get(properties.PRODUCTS),
            get(properties.VENDORS),
            get(properties.STOCKS_SUMMARY),
        ]).then(([stockResp, productsResp, vendorsResp, stockSummaryResp]) => {
            setProducts(productsResp);
            setVendors(vendorsResp);
            stockResp.forEach(element => {
                if(element.vendorId) {
                    debugger
                    const index = vendorsResp.findIndex((vendor)=> {
                        return vendor.id === element.vendorId
                    })
                    if(index >-1) {
                        element.vendorName = vendorsResp[index].name
                    }
                }
                if (element.purchaseDate) {
                    element.purchaseDate = formatDate(element.purchaseDate)
                }
                if (element.product) {
                    element.productName = element.product.name
                }
            });
            setItems(stockResp);
        })
    }, [item])

    const [error, setError] = useState({});

    const editItem = (item) => {
        if(item.isSettled) {
            toast.info('Amount is settled to the vendor. So cannot update this stock');
            item.isDisabled = true
        }
        setItem(item);
    }

    const deleteItem = (id) => {
        // deleteEntity(entityUrl + '/' + id)
        //     .then((resp) => {
        //         setItem({});
        //     });
        toast.info('This feature is in development')
    }

    const resetItem = (item) => {
        setItem({
            purchaseDate: '',
            totalPrice: '',
            pricePerUnit: '',
            measuringUnit: '',
            productId: '',
            vendorId: '',
            quantity: 0
        });
    }

    const getStockSummaryObject = (stockSummary, oldStock, newStock, id) => {
        stockSummary.balance = stockSummary.balance + (id ? Number(newStock.quantity) - Number(oldStock.quantity) : newStock.quantity)
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
        get(entityUrl)
        .then((existingStock)=> {
            method(url, item)
                .then((resp) => {
                    get(properties.STOCKS_SUMMARY, {
                        filter: JSON.stringify({
                            where: {
                                productId: item.productId
                            }
                        })
                    }).then((response) => {
                        const stockSummary = response[0];
                        put(properties.STOCKS_SUMMARY + '/' + stockSummary.id, getStockSummaryObject(stockSummary, existingStock, resp, item.id))
                        setItem(resp);
                    })
                    $('#stock-modal').modal('toggle');
                    toast.success("Stock saved successfully");
                })
        })
        .catch((err) => {
                toast.error("Error saving stock");
            })
    }

    const settleBill = (item) => {
        put(properties.STOCKS, {
            ...item,
            isSettled: !item.isSettled
        })
            .then((stockResp) => {
                toast.success('Bill settled successfully')
                resetItem();
            })
    }

    const data = {
        headers: ['purchaseDate', 'productName', 'quantity', 'pricePerUnit', 'totalPrice', 'measuringUnit', 'vendorName'],
        values: items
    }

    return (
        <AppDashboard>
            <div
                id="stock-modal" style={{ display: 'none' }}
                className="modal fade"
                data-backdrop="static"
                data-keyboard="false">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add/Edit Stock</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <div className={error.purchaseDate ? "error" : ""}>
                                        <label className="col-form-label">{'Purchase Date'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="date"
                                            placeholder=""
                                            disabled={item.isDisabled}
                                            value={item.purchaseDate}
                                            onChange={e => {
                                                setItem({
                                                    ...item,
                                                    purchaseDate: e.target.value.toUpperCase()
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.purchaseDate ? <span className="error-msg">{error.purchaseDate}</span> : ""}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Product</label>
                                    <select
                                        className="form-control form-control-lg"
                                        value={item.productId}
                                        disabled={item.isDisabled}
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
                                    <label>Vendors</label>
                                    <select
                                        className="form-control form-control-lg"
                                        value={item.vendorId}
                                        disabled={item.isDisabled}
                                        onChange={(e) => {
                                            setItem({ ...item, vendorId: e.target.value });
                                        }}
                                    >
                                        <option>Select</option>
                                        {!vendors
                                            ? ""
                                            : vendors.map((vendor, index) => {
                                                return (
                                                    <option key={uuid()} value={vendor.id}>
                                                        {vendor.name}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Measuring Unit</label>
                                    <select
                                        className="form-control form-control-lg"
                                        value={item.measuringUnit}
                                        disabled={item.isDisabled}
                                        onChange={(e) => {
                                            setItem({ ...item, measuringUnit: e.target.value });
                                        }}
                                    >
                                        <option>Select</option>
                                        <option value="piece">piece</option>
                                        <option value="kilogram">Kilogram</option>

                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className={error.quantity ? "error" : ""}>
                                        <label className="col-form-label">{'Quantity'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="number"
                                            placeholder=""
                                            disabled={item.isDisabled}
                                            value={item.quantity}
                                            onChange={e => {
                                                setItem({
                                                    ...item,
                                                    quantity: e.target.value.toUpperCase()
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.quantity ? <span className="error-msg">{error.quantity}</span> : ""}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className={error.totalPrice ? "error" : ""}>
                                        <label className="col-form-label">{'Total Price'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="number"
                                            placeholder=""
                                            disabled={item.isDisabled}
                                            value={item.totalPrice}
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
                                <div className="form-group">
                                    <div className={error.pricePerUnit ? "error" : ""}>
                                        <label className="col-form-label">{'Price per unit'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="number"
                                            placeholder=""
                                            value={item.pricePerUnit}
                                            disabled={item.isDisabled}
                                            onChange={e => {
                                                setItem({
                                                    ...item,
                                                    pricePerUnit: e.target.value.toUpperCase()
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.pricePerUnit ? <span className="error-msg">{error.pricePerUnit}</span> : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={e => {
                                resetItem();
                            }}>Close</button>
                            <button type="button" className="btn btn-primary" disabled={item.isDisabled} onClick={e => {
                                saveItem();
                            }}>Save Product</button>
                        </div>
                    </div>
                </div>
            </div>
            <DataTable title="Stock" data={data} isActionEnabled={true} editItem={editItem} deleteItem={deleteItem} addItem={resetItem} targetId="#stock-modal" settlement={settleBill} />
        </AppDashboard>
    )
};

export default Stock;

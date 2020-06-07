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
        .required('please enter a name for the product'),
    price: number().required('Please enter a price for the product').min(1),
    wastagePercentage: number().required('Please enter a wastage percentage for the product').min(1)
});

const Product = () => {

    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        price: 0,
        wastagePercentage: 0
    });

    useEffect(() => {
        get(properties.PRODUCTS)
            .then((resp) => {
                setProducts(resp)
            })
    }, [product])
    const [error, setError] = useState({});

    const editItem = (item) => {
        setProduct(item);
    }

    const deleteItem = (id) => {
        deleteEntity(properties.PRODUCTS +'/'+id)
            .then((resp) => {
                setProduct({});
            })
    }

    const resetProduct = (item) => {
        setProduct({
            name: '',
            price: 0,
            wastagePercentage: 0
        });
    }

    const saveProduct = () => {
        const error = validateS(validationSchema, product, setError);
        if (error) return;
        let url = properties.PRODUCTS
        let method = post
        if (product.id) {
            url = url + '/' + product.id
            method = put
        }
        method(url, product)
            .then((resp) => {
                if (!product.id) {
                    post(properties.STOCKS_SUMMARY, {
                        productId: resp.id,
                        balance: 0
                    })
                }
                setProduct(resp);
                $('#product-modal').modal('toggle');
                toast.success("Product saved successfully");
            }).catch((err)=> {
                toast.error("Error saving product");
            })
    }
    
    const data = {
        headers: ['name', 'price', 'wastagePercentage'],
        values: products
    }

    return (
        <AppDashboard>
            <div
                id="product-modal" style={{ display: 'none' }}
                className="modal fade"
                data-backdrop="static"
                data-keyboard="false">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add/Edit Product</h4>
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
                                            value={product.name}
                                            onChange={e => {
                                                setProduct({ ...product, name: e.target.value.toUpperCase() });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveProduct();
                                            }}
                                        />
                                        {error.name ? <span className="error-msg">{error.name}</span> : ""}
                                    </div>
                                    <div className={error.price ? "error" : ""}>
                                        <label className="col-form-label">{'Price'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="100.00"
                                            value={product.price}
                                            onChange={e => {
                                                setProduct({
                                                    ...product,
                                                    price: e.target.value.toUpperCase()
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveProduct();
                                            }}
                                        />
                                        {error.price ? <span className="error-msg">{error.price}</span> : ""}
                                    </div>
                                    <div className={error.wastagePercentage ? "error" : ""}>
                                        <label className="col-form-label">{'Wastage Percentage'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="number"
                                            placeholder="1"
                                            value={product.wastagePercentage}
                                            onChange={e => {
                                                setProduct({
                                                    ...product,
                                                    wastagePercentage: e.target.value.toUpperCase()
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveProduct();
                                            }}
                                        />
                                        {error.wastagePercentage ? <span className="error-msg">{error.wastagePercentage}</span> : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={e => {
                                resetProduct();
                            }}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={e=> {
                                saveProduct();
                            }}>Save Product</button>
                        </div>
                    </div>
                </div>
            </div>
            <DataTable title="Products" data={data} isActionEnabled={true} editItem={editItem} deleteItem={deleteItem} addItem={resetProduct} targetId="#product-modal" />
        </AppDashboard>
    )
};

export default Product;

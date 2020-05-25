import React, { useState, useEffect } from "react";
import AppDashboard from "../dashboard/dashboard"
import DataTable from "../common/data-table";
import { toast } from "react-toastify";
import { get, post, put, deleteEntity } from "./../util/restUtil";
import { properties } from "./../properties";
import $ from "jquery";
import { validateS } from "./../util/validateUtil";
import { uuid } from "uuidv4";

const entityUrl = properties.EXPENSES
const salaryPerDelivery = 30
const petrolAllowancePerKm = 2.5
const Expenses = () => {

    const [items, setItems] = useState({
        delivery: [],
        material: [],
        other: []
    });
    const [item, setItem] = useState({});

    useEffect(() => {
        
            get(entityUrl).then((resp) => {
            const data = {}
            resp.forEach((expense) => {
                if(!data[expense.type]) {
                    data[expense.type] = []
                }
                data[expense.type].push(expense)
            })
            setItems(data);
        })
    }, [item])

    const [error, setError] = useState({});

    const editItem = (item) => {
        setItem(item);
    }

    const deleteItem = (id) => {
        toast.info('This feature is in development')
    }

    const resetItem = (item) => {
        setItem({
            type: '',
            status: '',
            paidBy: '',
            paidTo: '',
        });
    }

    const saveItem = () => {
        debugger
        if (!(item.type && item.expenseDate)) {
            return toast.error("Mandatory fields missing")
        }
        if (item.type === "delivery" &&
            !(item.riderName && item.noOfDelivery && item.kms && item.perDeliveryCost && item.incentive && item.petrolCharge && item.totalPrice)
        ) {
            return toast.error("Mandatory fields missing")
        } else if (item.type !== "delivery" &&
            !(item.totalPrice && item.status)
        ) {
            return toast.error("Mandatory fields missing")
        }
        let url = properties.EXPENSES
        let method = post
        if (item.id) {
            url = url + '/' + item.id
            method = put
        }
        method(url, item)
            .then((resp) => {
                if (!item.id) {
                    post(properties.STOCKS_SUMMARY, {
                        productId: resp.id,
                        balance: 0
                    })
                }
                setItem(resp);
                $('#expense-modal').modal('toggle');
                toast.success("Expenses saved successfully");
            }).catch((err) => {
                toast.error("Error saving expenses");
            })
    }

    const calculateIncentive = (noOfDelivery) => {
        // =((D35 * 30) + (E35 * 2.5) + ((D35 >= 12) + 75))
        const deliverySalary = noOfDelivery * salaryPerDelivery;
        let incentive = 0
        if(noOfDelivery >= 12) {
            incentive = 75
        } else if (noOfDelivery >= 12 && noOfDelivery <=20) {
            incentive = 100
        } else if (noOfDelivery > 20) {
            incentive = 200
        }
        return deliverySalary + incentive
    }

    const calculatePetrolcharge = (noOfKilometer = 0) => {
        return petrolAllowancePerKm * noOfKilometer
    }

    const deliveryData = {
        headers: ['type', 'expenseDate', 'riderName', 'noOfDelivery', 'kms', 'perDeliveryCost', 'incentive', 'petrolCharge', 'totalPrice','paidBy', 'paidTo'],
        values: items['delivery']
    }
    const materialData = {
        headers: ['type', 'expenseDate', 'itemName', 'pricePerUnit', 'quantity', 'totalPrice', 'paidBy', 'paidTo', 'status'],
        values: items['material'] || []
    }
    const otherData = {
        headers: ['type', 'expenseDate', 'riderName', 'noOfDelivery', 'kms', 'perDeliveryCost', 'incentive', 'petrolCharge', 'totalPrice', 'paidBy', 'paidTo', 'status'],
        values: items['other'] || []
    }

    return (
        <AppDashboard>
            <div
                id="expense-modal" style={{ display: 'none' }}
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
                                    <div className={error.expenseDate ? "error" : ""}>
                                        <label className="col-form-label">{'Expense Date'}*</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="date"
                                            placeholder=""
                                            disabled={item.isDisabled}
                                            value={item.expenseDate}
                                            onChange={e => {
                                                setItem({
                                                    ...item,
                                                    expenseDate: e.target.value
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.expenseDate ? <span className="error-msg">{error.expenseDate}</span> : ""}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>What expenses ?</label>
                                    <select
                                        className="form-control form-control-lg"
                                        value={item.type}
                                        disabled={item.isDisabled}
                                        onChange={(e) => {
                                            setItem({ ...item, type: e.target.value });
                                        }}
                                    >
                                        <option>Select</option>
                                        <option key={uuid()} value={'material'}>Material Expenses</option>
                                        <option key={uuid()} value={'delivery'}>Delivery Expenses</option>
                                        <option key={uuid()} value={'other'}>Other</option>
                                    </select>
                                </div>
                                {
                                    item.type !== "delivery" ?
                                        <div>
                                            <div class="form-group">
                                                <div className={error.itemName ? "error" : ""}>
                                                    <label className="col-form-label">{'Item Name'}*</label>
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder=""
                                                        disabled={item.isDisabled}
                                                        value={item.itemName}
                                                        onChange={e => {
                                                            setItem({
                                                                ...item,
                                                                itemName: e.target.value
                                                            });
                                                        }}
                                                        onKeyPress={e => {
                                                            if (e.key === "Enter") saveItem();
                                                        }}
                                                    />
                                                    {error.itemName ? <span className="error-msg">{error.itemName}</span> : ""}
                                                </div>
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
                                        </div>
                                        :
                                        <div>
                                            <div className="form-group">
                                                <div className={error.riderName ? "error" : ""}>
                                                    <label className="col-form-label">{'Rider Name'}*</label>
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder=""
                                                        value={item.riderName}
                                                        disabled={item.isDisabled}
                                                        onChange={e => {
                                                            setItem({
                                                                ...item,
                                                                perDeliveryCost: 30,
                                                                riderName: e.target.value.toUpperCase()
                                                            });
                                                        }}
                                                        onKeyPress={e => {
                                                            if (e.key === "Enter") saveItem();
                                                        }}
                                                    />
                                                    {error.riderName ? <span className="error-msg">{error.riderName}</span> : ""}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className={error.noOfDelivery ? "error" : ""}>
                                                    <label className="col-form-label">{'No Of Delivery'}*</label>
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="number"
                                                        placeholder=""
                                                        value={item.noOfDelivery}
                                                        disabled={item.isDisabled}
                                                        onChange={e => {
                                                            const incentive = calculateIncentive(e.target.value);
                                                            setItem({
                                                                ...item,
                                                                noOfDelivery: e.target.value,
                                                                incentive: incentive,
                                                                perDeliveryCost: 30,
                                                                totalPrice: Number(incentive) + Number(item.petrolCharge || 0)
                                                            });
                                                        }}
                                                        onKeyPress={e => {
                                                            if (e.key === "Enter") saveItem();
                                                        }}
                                                    />
                                                    {error.noOfDelivery ? <span className="error-msg">{error.noOfDelivery}</span> : ""}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className={error.kms ? "error" : ""}>
                                                    <label className="col-form-label">{'Kilometers travelled'}*</label>
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="number"
                                                        placeholder=""
                                                        value={item.kms}
                                                        disabled={item.isDisabled}
                                                        onChange={e => {
                                                            const petrolCharge = calculatePetrolcharge(e.target.value)
                                                            setItem({
                                                                ...item,
                                                                kms: e.target.value,
                                                                perDeliveryCost: 30,
                                                                petrolCharge: petrolCharge,
                                                                totalPrice: Number(item.incentive || 0) + Number(petrolCharge)

                                                            });
                                                        }}
                                                        onKeyPress={e => {
                                                            if (e.key === "Enter") saveItem();
                                                        }}
                                                    />
                                                    {error.kms ? <span className="error-msg">{error.kms}</span> : ""}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className={error.perDeliveryCost ? "error" : ""}>
                                                    <label className="col-form-label">{'Salary per delivery'}*</label>
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="number"
                                                        placeholder=""
                                                        value={30}
                                                        disabled={true}
                                                        onChange={e => {
                                                            setItem({
                                                                ...item,
                                                                perDeliveryCost: e.target.value
                                                            });
                                                        }}
                                                        onKeyPress={e => {
                                                            if (e.key === "Enter") saveItem();
                                                        }}
                                                    />
                                                    {error.perDeliveryCost ? <span className="error-msg">{error.perDeliveryCost}</span> : ""}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className={error.incentive ? "error" : ""}>
                                                    <label className="col-form-label">{'Incentive'}*</label>
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="number"
                                                        placeholder=""
                                                        value={item.incentive}
                                                        disabled={true}
                                                        onChange={e => {
                                                            setItem({
                                                                ...item,
                                                                incentive: e.target.value
                                                            });
                                                        }}
                                                        onKeyPress={e => {
                                                            if (e.key === "Enter") saveItem();
                                                        }}
                                                    />
                                                    {error.incentive ? <span className="error-msg">{error.incentive}</span> : ""}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className={error.petrolCharge ? "error" : ""}>
                                                    <label className="col-form-label">{'Petrol Charge'}*</label>
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="number"
                                                        placeholder=""
                                                        value={item.petrolCharge}
                                                        disabled={true}
                                                        onChange={e => {
                                                            setItem({
                                                                ...item,
                                                                petrolCharge: e.target.value
                                                            });
                                                        }}
                                                        onKeyPress={e => {
                                                            if (e.key === "Enter") saveItem();
                                                        }}
                                                    />
                                                    {error.petrolCharge ? <span className="error-msg">{error.petrolCharge}</span> : ""}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className={error.totalPrice ? "error" : ""}>
                                                    <label className="col-form-label">{'Total Price'}*</label>
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="number"
                                                        placeholder=""
                                                        disabled={true}
                                                        value={item.totalPrice}
                                                        onChange={e => {
                                                            setItem({
                                                                ...item,
                                                                totalPrice: e.target.value
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
                                }
                                <div className="form-group">
                                    <div className={error.paidBy ? "error" : ""}>
                                        <label className="col-form-label">{'Paid By'}</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder=""
                                            value={item.paidBy}
                                            onChange={e => {
                                                setItem({
                                                    ...item,
                                                    paidBy: e.target.value
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.paidBy ? <span className="error-msg">{error.paidBy}</span> : ""}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className={error.paidTo ? "error" : ""}>
                                        <label className="col-form-label">{'Paid to'}</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder=""
                                            value={item.paidTo}
                                            onChange={e => {
                                                setItem({
                                                    ...item,
                                                    paidTo: e.target.value
                                                });
                                            }}
                                            onKeyPress={e => {
                                                if (e.key === "Enter") saveItem();
                                            }}
                                        />
                                        {error.paidTo ? <span className="error-msg">{error.paidTo}</span> : ""}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Expenses Status ?</label>
                                    <select
                                        className="form-control form-control-lg"
                                        value={item.status}
                                        disabled={item.isDisabled}
                                        onChange={(e) => {
                                            setItem({ ...item, status: e.target.value });
                                        }}
                                    >
                                        <option>Select</option>
                                        <option key={uuid()} value={'pending'}>pending</option>
                                        <option key={uuid()} value={'paid'}>Paid</option>
                                        <option key={uuid()} value={'partiallyPaid'}>Partially Paid</option>
                                    </select>
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
            <DataTable className="pb-4" title="Material Expenses" data={materialData} isActionEnabled={true} editItem={''} deleteItem={''} addItem={resetItem} targetId="#expense-modal" />
            <DataTable className="pt-4 pb-4" title="Delivery Expenses" data={deliveryData} isActionEnabled={true} editItem={''} deleteItem={''} addItem={resetItem} targetId="#expense-modal" />
            <DataTable className="pt-4" title="Other Expenses" data={otherData} isActionEnabled={true} editItem={''} deleteItem={''} addItem={resetItem} targetId="#expense-modal" />
        </AppDashboard>
    )
};

export default Expenses;

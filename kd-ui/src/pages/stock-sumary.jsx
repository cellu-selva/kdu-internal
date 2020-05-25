import React, { useState, useEffect } from "react";
import AppDashboard from "../dashboard/dashboard"
import DataTable from "../common/data-table";
import { get } from "./../util/restUtil";
import { properties } from "./../properties";

const entityUrl = properties.STOCKS_SUMMARY

const StockSummary = () => {

    const [items, setItems] = useState([]);
    useEffect(() => {
        Promise.all([
            get(entityUrl),
            get(properties.STOCKS, {
                "filter": JSON.stringify({
                    "include": ["product", "vendor"]
                })
            }),
        ]).then(([stockSummaryResp, stockResp]) => {
            const grp = {}
            stockResp.forEach((stock) => {
                const productName = stock.product.name
                if (!grp[productName]) {
                    grp[productName] = {
                        quantity: 0,
                        totalPrice: 0
                    }
                }
                grp[productName] = {
                    productId: stock.productId,
                    productName,
                    measuringUnit: stock.measuringUnit,
                    quantity: grp[productName].quantity + Number(stock.quantity),
                    totalPrice: grp[productName].totalPrice + Number(stock.totalPrice),
                }
            });
            const stockSummary = [];
            for (const key in grp) {
                if (grp.hasOwnProperty(key)) {
                    const index = stockSummaryResp.findIndex((stock) => {
                        return stock.productId === grp[key].productId
                    })
                    const element = {
                        ...grp[key],
                        averagePurchasePrice: grp[key].totalPrice / grp[key].quantity
                    }
                    if(index > -1) {
                        element.availableBalance = stockSummaryResp[index].balance.toFixed(2);
                        element.measuringUnit = grp[key].measuringUnit
                    }
                    stockSummary.push(element);
                }
            }
            setItems(stockSummary);
        })
    }, [])
    
    const data = {
        headers: ['productName', 'availableBalance', 'measuringUnit', 'quantity', 'averagePurchasePrice', 'totalPrice'],
        values: items
    }

    return (
        <AppDashboard>
            <DataTable title="Stock Summary" data={data} isActionEnabled={true} />
        </AppDashboard>
    )
};

export default StockSummary;

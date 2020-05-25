/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { uuid } from 'uuidv4';
import { camelCaseToSpaces } from '../util/util'
const noop = () => { }

const DataTable = ({ className, data, title, isActionEnabled, editItem, deleteItem, addItem, targetId, settlement }) => {
    const { headers, values } = data
    return (
        <div className={className}>
            <section class="pt-4 container-fluid">
                <div class="card">
                    <div className="card-header">
                        <h3 className="card-title" style={{ display: 'inline-block' }}>Kadal Unavu {title} List</h3>
                        {
                            addItem ? 
                            <button style={{ float: 'right' }} type="button" className="btn btn-tool" data-toggle="modal"
                                data-target={targetId} onClick={addItem}>
                                <i className="fas fa-plus fa-2x"></i>
                            </button>
                            : ''
                        }
                    </div>
                </div>
                <div class="card-body p-0">
                    {values && values.length ? 
                        <table class="table table-striped projects">
                            <thead>
                                <tr>
                                    <th>S.no</th>
                                    {headers.map((header) => (
                                        <th className="text-capitalize" key={uuid()}>{camelCaseToSpaces(header)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {values && values.length ?
                                    values.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>#{index+1}</td>
                                                {headers.map(key => (
                                                    <td key={uuid()}>{item[key]}</td>
                                                ))}
                                                {
                                                    isActionEnabled ?
                                                        <td className="project-actions text-right">
                                                            {
                                                                (settlement && !item.isSettled) ?
                                                                    <a className="btn btn-info btn-lg" href="#" onClick={(e) => {
                                                                        settlement(item);
                                                                    }}>
                                                                        <i className="fas fa-rupee-sign"></i>
                                                                        &nbsp;&nbsp;
                                                                        Settle bill
                                                    </a>
                                                                    : ''
                                                            }
                                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                                    {editItem ?
                                                                <a className="btn btn-info btn-lg" href="#" data-toggle="modal"
                                                                    data-target={targetId} onClick={(e) => {
                                                                        editItem(item);
                                                                    }}>
                                                                    <i className="fas fa-pencil-alt"></i>
                                                                    &nbsp;&nbsp;
                                                                    Edit
                                                    </a>
                                                                : ''
                                                            }
                                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                                    {
                                                                deleteItem ?
                                                                    <a className="btn btn-danger btn-lg" href="#" onClick={(e) => {
                                                                        deleteItem(item.id);
                                                                    }}>
                                                                        <i className="fas fa-trash"></i>
                                                                        &nbsp;&nbsp;
                                                                        Delete
                                                    </a>
                                                                    :
                                                                    ''
                                                            }
                                                        </td>
                                                        : ''
                                                }
                                            </tr>
                                        )
                                    }
                                    ) : ''
                                }
                            </tbody>
                        </table>
                    : 
                    <div style={{height: '300px', width: '100%', textAlign: 'center', lineHeight: '150px'}}>
                        No Data
                    </div>
                    }
                    
                </div>
            </section>
            {/* <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>{title}</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <a onClick={e => {
                                        history.push('/product');
                                    }}>Home</a></li>
                                <li className="breadcrumb-item active">{title}</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title" style={{ display: 'inline-block' }}>Kadal Unavu {title} List</h3>
                                    <button style={{ float: 'right' }} type="button" className="btn btn-tool" data-toggle="modal"
                                        data-target={targetId} onClick={addItem}>
                                        <i className="fas fa-plus fa-2x"></i>
                                    </button>
                                </div>
                                <div className="card-body">
                                    <table id="example2" className="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                {headers.map((header) => (
                                                    <th key={uuid()}>{header}</th>
                                                ))}
                                                {
                                                    isActionEnabled ?
                                                        <th>
                                                            Actions
                                                                    </th>
                                                        : ''
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {values.map((item) => {
                                                return (
                                                    <tr>
                                                        {headers.map(key => (
                                                            <td key={uuid()}>{item[key]}</td>
                                                        ))}
                                                        {
                                                            isActionEnabled ?
                                                                <td>
                                                                    <div class="btn-group">
                                                                        <button class="rounded btn btn-primary btn-md"
                                                                            data-toggle="modal"
                                                                            data-target={targetId} onClick={(e) => {
                                                                            editItem(item);
                                                                        }}>Edit</button>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                                        <button class="rounded btn btn-primary btn-md" onClick={(e) => {
                                                                            deleteItem(item.id);
                                                                        }}>Delete</button> 
                                                                    </div>
                                                                </td>
                                                                : ''
                                                        }
                                                    </tr>
                                                )
                                            }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div> */}
        </div>
    )
}
export default DataTable

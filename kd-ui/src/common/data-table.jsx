/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { uuid } from 'uuidv4';
import { camelCaseToSpaces } from '../util/util'
import ReactPaginate from 'react-paginate';

const DataTable = ({ pagination, className, data, title, isActionEnabled, editItem, deleteItem, addItem, targetId, settlement }) => {
    const { headers, values, count } = data
    
    const handlePageClick = (e) => {
        console.log(e)
    }
    return (
        <div className={className}>
            <section className="pt-4 container-fluid">
                <div className="card">
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
                <div className="card-body p-0">
                    {values && values.length ?
                        <div>
                            <table className="table table-striped projects">
                                <thead>
                                    <tr key={uuid()}>
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
                                                <tr key={uuid()}>
                                                    <td key={uuid()}>#{index + 1}</td>
                                                    {headers.map(key => (
                                                        <td key={uuid()}>{item[key]}</td>
                                                    ))}
                                                    {
                                                        isActionEnabled ?
                                                            <td key={uuid()} className="project-actions text-right">
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
                            {
                                pagination ?
                                    <ReactPaginate
                                        previousLabel={'previous'}
                                        nextLabel={'next'}
                                        breakLabel={'...'}
                                        breakClassName={'break-me'}
                                        pageCount={Math.ceil(count / 10)}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={handlePageClick}
                                        containerClassName={'pagination'}
                                        subContainerClassName={'pages pagination'}
                                        activeClassName={'active'}
                                    />
                                    : ''
                            }
                        </div>
                        :
                        <div style={{ height: '300px', width: '100%', textAlign: 'center', lineHeight: '150px' }}>
                            No Data
                    </div>
                    }

                </div>
            </section>
        </div>
    )
}
export default DataTable

import React, { useState, useEffect } from "react";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5"
import { useNavigate } from "react-router";

const ConfirmModal = ({ selectedAssetName, open, setOpen }) => {
    const navigate = useNavigate()
    const [linkedMessage, setLinkedMessage] = useState(false)
    return (
        <>
            <div>
                <input type="checkbox" id="my_modal_6" className="modal-toggle" checked={open} />
                <div className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm</h3>
                        <p className="py-4">Do you want to link the asset {selectedAssetName} to the QR</p>
                        <div className="flex flex-row justify-center w-full gap-5">
                            <button className="btn bg-blue-900 hover:bg-blue-900" onClick={() => {
                                setOpen()
                                setLinkedMessage(true)
                            }}>Yes</button>
                            <button className="btn bg-blue-900 hover:bg-blue-900" onClick={setOpen}>Cancel</button>
                        </div>

                    </div>
                </div>
            </div>
            <div>
                <input type="checkbox" id="my_modal_7" className="modal-toggle" checked={linkedMessage} />
                <div className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Asset Linked</h3>
                        <div className=" flex flex-col w-full justify-center items-center">
                            <IoCheckmarkDoneCircleOutline className="text-8xl text-green-500" />
                            {/* <img src={done} alt="success" className="w-8 h-8 text-green-500" /> */}
                            <p className="py-4">{selectedAssetName} have been linked to the QR</p>
                        </div>
                        <div className="flex flex-row justify-center w-full gap-5">
                            <button className="btn bg-blue-900 hover:bg-blue-900" onClick={() => {
                                setLinkedMessage(false)
                                navigate("/scan")
                            }}>Done</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmModal;
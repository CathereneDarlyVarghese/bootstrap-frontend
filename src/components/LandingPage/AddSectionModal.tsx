import React from "react";
import { TfiClose } from "react-icons/tfi";

const AddSectionModal = () => (
        <>
            <input type="checkbox" checked={false} id="my_modal_6" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <div className="flex flex-row items-center">
                        <h3 className="font-bold text-lg">Add Section</h3>
                        <button className="ml-auto">
                            <TfiClose />
                        </button>
                    </div>
                    <input type="text" placeholder="Section Name" required className="input input-bordered input-sm text-sm w-full my-5 font-sans" />
                    <div className="flex flex-row justify-center">
                        <button className="btn bg-blue-900 hover:bg-blue-900">Submit</button>
                    </div>
                </div>
            </div>

        </>
);

export default AddSectionModal;

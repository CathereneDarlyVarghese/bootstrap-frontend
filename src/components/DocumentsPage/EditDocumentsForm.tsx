import React, { useState } from "react";

import { TfiClose } from "react-icons/tfi";
import { AiOutlinePaperClip } from "react-icons/ai";



const EditDocumentsForm = ({ open, close }) => {
    const [file, setFile] = useState<any>();

    const handleChange = (e) => {
        console.log(e.target.value)
    }

    return (
        <>
            <input type="checkbox" checked={open} id="my_modal_6" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box max-h-full" >
                    <div className="flex flex-row">
                        <h3 className="font-sans font-bold text-lg text-blue-800 dark:text-white">
                            Edit Document
                        </h3>
                        <button onClick={close} className="ml-auto">
                            <TfiClose className="text-blue-800" />
                        </button>
                    </div>
                    <div className="my-3">
                        <form>

                            <div className="flex flex-col p-5">
                                {/* Input field for asset name */}
                                <label className="font-sans font-semibold text-black dark:text-white text-sm">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="documentName"
                                    name="documentName"
                                    onChange={(e) => handleChange(e)}
                                    required
                                    placeholder="Enter Document Name"
                                    className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                                />
                                <label className="font-sans font-semibold text-sm text-black dark:text-white">
                                    Document Type
                                </label>
                                <select
                                    id="documentType"
                                    name="documentType"
                                    onChange={(e) => handleChange(e)}
                                    className="select select-sm my-3 text-black dark:text-white bg-transparent dark:border-gray-500 w-full border border-slate-300"
                                    required
                                >
                                    <option value="" disabled selected hidden >
                                        Select Document Type
                                    </option>
                                    {/* {documentType.map((documentType) => (
                                        <option className="text-black bg-white dark:text-white dark:bg-gray-800"
                                            key={documentType.document_type_id}
                                            value={documentType.document_type_id}
                                        >
                                            {documentType.document_type}
                                        </option>
                                    ))} */}
                                </select>

                                <div className="flex flex-row gap-2 my-3">
                                    <div className="flex flex-col">
                                        <label className="font-sans font-semibold text-sm text-black dark:text-white">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            onChange={(e) => handleChange(e)}
                                            required
                                            className="font-sans font-semibold border text-sm text-black dark:text-white bg-white dark:sm:border-gray-500 dark:2xl:border-transparent dark:2xl:bg-transparent my-3"
                                        />
                                    </div>
                                    <div className="flex flex-col ml-auto">
                                        <label className="font-sans font-semibold text-sm text-black dark:text-white">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            onChange={(e) => handleChange(e)}
                                            required
                                            className="font-sans font-semibold border text-sm text-black dark:text-white bg-white dark:sm:border-gray-500 dark:2xl:border-transparent dark:2xl:bg-transparent my-3"
                                        />
                                    </div>
                                </div>

                                <label className="font-sans font-semibold text-sm text-black dark:text-white">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    id="documentDescription"
                                    name="documentDescription"
                                    onChange={(e) => handleChange(e)}
                                    required
                                    placeholder="Enter Description"
                                    className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                                />

                                {/* File input for uploading an image */}
                                <label
                                    htmlFor="file_input"
                                    className="font-sans font-semibold text-sm text-black dark:text-white"
                                >
                                    Upload File
                                </label>
                                <input
                                    type="file"
                                    required
                                    id="file"
                                    name="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="block w-full text-md text-white border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans my-3 hidden"

                                />
                                <div className="flex flex-row rounded-lg border border-gray-300 dark:border-gray-500 p-2 my-2">
                                    <input type="text" value={`${file ? file.name : "No file chosen"}`} className={`bg-transparent text-sm font-sans w-4/5 md:w-1/2 ${file && file ? "text-black dark:text-white" : "text-gray-400"}`} />
                                    <button className="btn btn-xs bg-transparent border border-gray-400 hover:border-gray-400 hover:bg-transparent normal-case font-normal w-fit border text-blue-600 dark:text-white font-sans text-xs md:text-[9px] p-0.5  rounded-xl ml-auto" onClick={(e) => {
                                        e.preventDefault()
                                        const uploadButton = document.querySelector("#file") as HTMLElement
                                        uploadButton.click()
                                    }}>
                                        <AiOutlinePaperClip className="text-lg" />
                                        Choose File</button>
                                </div>


                                <label className="font-sans font-semibold text-sm text-black dark:text-white">
                                    Notes
                                </label>
                                <input
                                    type="text"
                                    id="documentNotes"
                                    name="documentNotes"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter Description"
                                    // onChange={(e) =>
                                    //   setData((curr) => ({ ...curr, name: e.target.value }))
                                    // }
                                    // value={data.name}
                                    className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-row justify-center">
                        <button className="btn btn-sm bg-blue-900 hover:bg-blue-800" onClick={close}>Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditDocumentsForm;
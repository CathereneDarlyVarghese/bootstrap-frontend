import React, { useState } from "react";

import { TfiClose } from "react-icons/tfi";



const FilterOptions = ({ filterClose }) => {
    const [selectedButtonsSection, setSelectedButtonsSection] = useState([])
    const [selectedButtonsLocation, setSelectedButtonsLocation] = useState([])
    const [selectedButtonsStatus, setSelectedButtonsStatus] = useState([])
    const filterButtonsSection = [
        { title: "Kitchen", info: "" },
        { title: "Lounge", info: "" },
        { title: "Bar", info: "" },
        { title: "Restaurant", info: "" },
        { title: "Lounge", info: "" },
        { title: "Hall", info: "" },
    ]
    const filterButtonsLocation = [
        { title: "The Spiffy Dapper", info: "" },
        { title: "MadDog Bistro & Bar", info: "" },
        { title: "Location A", info: "" },
        { title: "Location B", info: "" },
        { title: "Location C", info: "" },
        { title: "Location D", info: "" },
    ]
    const filterButtonsStatus = [
        { title: "Working", info: "" },
        { title: "Down", info: "" },
        { title: "Maintenance", info: "" }

    ]

    const handleReset = () => {
        setSelectedButtonsLocation([])
        setSelectedButtonsSection([])
        setSelectedButtonsStatus([])
    }

    const handleSectionClick = (buttonIndex) => {
        if (selectedButtonsSection.includes(buttonIndex)) {
            setSelectedButtonsSection(selectedButtonsSection.filter((index) => index !== buttonIndex))
        } else {
            setSelectedButtonsSection([...selectedButtonsSection, buttonIndex])
        }
    }
    const handleLocationClick = (buttonIndex) => {
        if (selectedButtonsLocation.includes(buttonIndex)) {
            setSelectedButtonsLocation(selectedButtonsLocation.filter((index) => index !== buttonIndex))
        } else {
            setSelectedButtonsLocation([...selectedButtonsLocation, buttonIndex])
        }
    }

    const handleStatusClick = (buttonIndex) => {
        if (selectedButtonsStatus.includes(buttonIndex)) {
            setSelectedButtonsStatus(selectedButtonsStatus.filter((index) => index !== buttonIndex))
        } else {
            setSelectedButtonsStatus([...selectedButtonsStatus, buttonIndex])
        }
    }

    return (
        <div className="p-2">
            <div className="flex flex-row">
                <h1 className="font-sans font-semibold">Fitler and Sort</h1>
                <div className="flex flex-row gap-2 ml-auto">
                    <button className="btn btn-sm bg-blue-900 hover:bg-blue-900 font-normal px-4 font-sans rounded-full capitalize ml-auto">Done</button>
                    <button className="btn btn-sm bg-blue-900 hover:bg-blue-900 font-normal px-4 font-sans rounded-full capitalize ml-auto" onClick={handleReset}>Reset</button>
                    <button onClick={filterClose}>
                        <TfiClose className="text-blue-700 ml-2" />
                    </button>
                </div>

            </div>
            <div>
                <h1 className="font-sans">Sort by Location:</h1>
                {
                    filterButtonsLocation.map((button, index) => (
                        <button
                            key={index} className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${selectedButtonsLocation.includes(index) ? "bg-blue-200 hover:bg-blue-200" : "bg-white hover:bg-white"} border-blue-500 hover:border-blue-500 rounded-full m-1`} onClick={() => handleLocationClick(index)}>
                            {button.title}
                        </button>
                    ))
                }
            </div>
            <div className="my-3">
                <h1 className="font-sans">Sort by Section:</h1>
                {
                    filterButtonsSection.map((button, index) => (
                        <button
                            key={index} className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${selectedButtonsSection.includes(index) ? "bg-blue-200 hover:bg-blue-200" : "bg-white hover:bg-white"} border-blue-500 hover:border-blue-500 rounded-full m-1`} onClick={() => handleSectionClick(index)}>
                            {button.title}
                        </button>
                    ))
                }
            </div>
            <div className="my-3">
                <h1 className="font-sans">Sort by Status:</h1>
                {
                    filterButtonsStatus.map((button, index) => (
                        <button className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${selectedButtonsStatus.includes(index) ? "bg-blue-200 hover:bg-blue-200" : "bg-white hover:bg-white"} border-blue-500 hover:border-blue-500 rounded-full m-1`}
                            onClick={() => handleStatusClick(index)}
                        >{button.title}</button>
                    ))
                }
            </div>
        </div>

    )
}

export default FilterOptions;
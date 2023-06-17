import React from 'react'

const DisplayDocument = ({ closeFile }) => {
    return (
        <div className="rounded-xl p-3 bg-white dark:bg-gray-800">
            <div className="p-0 mb-5 w-full sm:mx-2">
                <div className="flex flex-row">
                    <h1 className="font-sans font-semibold text-blue-900 dark:text-white">Document name</h1>
                    <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        strokeWidth="1.5"
                        className="w-6 h-6 text-blue-800 dark:text-white ml-auto cursor-pointer"
                        onClick={closeFile}
                    >
                        <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
                <div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula arcu eu ligula volutpat bibendum. Fusce venenatis eu urna vel tincidunt. Curabitur sagittis laoreet purus in maximus. Praesent eu nulla id justo auctor sagittis ut ut nulla. Praesent tempor tellus ut nulla interdum varius. Proin tristique hendrerit dui sed efficitur. Morbi convallis consequat pretium. Proin tortor nisi, placerat vitae turpis eget, vestibulum iaculis dolor. Aliquam venenatis feugiat lorem vitae lacinia. Mauris congue massa et magna auctor, a imperdiet ipsum commodo. In hac habitasse platea dictumst. Suspendisse nec odio volutpat, pretium leo id, porta mi. Sed suscipit magna semper iaculis imperdiet. Morbi non nibh scelerisque, viverra diam id, dapibus diam.</p>
                </div>
            </div>
        </div>
    )
}

export default DisplayDocument
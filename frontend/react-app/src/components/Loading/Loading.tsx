import React from "react";
import "./Loading.css";

interface LoadingProps {
    title: boolean;
}

const Loading: React.FC<LoadingProps> = ({ title }) => {
    return (
        <div className={`${title ? 'loading-container' : 'loading-container-no-title'}`}>

            {title && (
                <>
                    <h1>Oficina Oliveira</h1>
                    <h2>Stock Management</h2>
                </>
            )}
            <div className="loader">
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
            </div>
        </div>
    );
};

export default Loading;

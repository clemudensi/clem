import React from 'react';
import AwesomeComponent from './Spinner';

export const MyLoadingComponent = ({ isLoading, error }) => {
    // Handle the loading state
    if (isLoading) {
        return <div><AwesomeComponent /></div>;
    }
    // Handle the error state
    if (error) {
        return <div>Sorry, there was a problem loading the page.</div>;
    }

    return null;
};

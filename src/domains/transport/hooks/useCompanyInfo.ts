import { useState, useCallback } from 'react';

const DEFAULT_COMPANY = '㈜지산건기';
const DEFAULT_CONTACT = '010-3437-7661';
const DEFAULT_REGNO = '543-81-01295';

export function useCompanyInfo() {
    const [company, setCompany] = useState(DEFAULT_COMPANY);
    const [contact, setContact] = useState(DEFAULT_CONTACT);
    const [regNo, setRegNo] = useState(DEFAULT_REGNO);

    const updateCompany = useCallback((value: string) => {
        setCompany(value);
    }, []);

    const updateContact = useCallback((value: string) => {
        setContact(value);
    }, []);

    const updateRegNo = useCallback((value: string) => {
        setRegNo(value);
    }, []);

    const resetToDefaults = useCallback(() => {
        setCompany(DEFAULT_COMPANY);
        setContact(DEFAULT_CONTACT);
        setRegNo(DEFAULT_REGNO);
    }, []);

    return {
        company,
        contact,
        regNo,
        updateCompany,
        updateContact,
        updateRegNo,
        resetToDefaults,
    };
}
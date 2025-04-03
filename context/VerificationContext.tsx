import { createContext, useContext, useReducer, ReactNode } from 'react';

type VerificationState = {
    step: number;
    country: string | null;
    idType: 'national' | 'passport' | null;
    frontImage: string | null;
    backImage: string | null;
    selfieImage: string | null;
    loading: boolean;
    error: string | null;
    success: boolean;
};

type VerificationAction =
    | { type: 'SET_COUNTRY'; payload: string }
    | { type: 'SET_ID_TYPE'; payload: 'national' | 'passport' }
    | { type: 'SET_FRONT_IMAGE'; payload: string }
    | { type: 'SET_BACK_IMAGE'; payload: string }
    | { type: 'SET_SELFIE_IMAGE'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_SUCCESS'; payload: boolean };

const initialState: VerificationState = {
    step: 1,
    country: null,
    idType: null,
    frontImage: null,
    backImage: null,
    selfieImage: null,
    loading: false,
    error: null,
    success: false,
};

const VerificationContext = createContext<{
    state: VerificationState;
    dispatch: React.Dispatch<VerificationAction>;
    submitVerification: () => Promise<void>;
} | null>(null);

function verificationReducer(
    state: VerificationState,
    action: VerificationAction
): VerificationState {
    switch (action.type) {
        case 'SET_COUNTRY':
            return { ...state, country: action.payload, step: 2 };
        case 'SET_ID_TYPE':
            return { ...state, idType: action.payload, step: 3 };
        case 'SET_FRONT_IMAGE':
            return { ...state, frontImage: action.payload };
        case 'SET_BACK_IMAGE':
            return { ...state, backImage: action.payload };
        case 'SET_SELFIE_IMAGE':
            return { ...state, selfieImage: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_SUCCESS':
            return { ...state, success: action.payload };
        default:
            return state;
    }
}

export function VerificationProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(verificationReducer, initialState);

    const submitVerification = async () => {
        if (!state.country || !state.idType || !state.frontImage || !state.backImage || !state.selfieImage) {
            dispatch({ type: 'SET_ERROR', payload: 'Missing required information' });
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock API request body
            const verificationData = {
                country: state.country,
                idType: state.idType,
                frontImage: state.frontImage,
                backImage: state.backImage,
                selfieImage: state.selfieImage,
            };

            console.log('Submitting verification:', verificationData);

            dispatch({ type: 'SET_SUCCESS', payload: true });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to submit verification' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return (
        <VerificationContext.Provider value={{ state, dispatch, submitVerification }}>
            {children}
        </VerificationContext.Provider>
    );
}

export function useVerification() {
    const context = useContext(VerificationContext);
    if (!context) {
        throw new Error('useVerification must be used within a VerificationProvider');
    }
    return context;
}
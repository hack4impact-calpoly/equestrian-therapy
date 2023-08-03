/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Timeslot } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type TimeslotUpdateFormInputValues = {
    startTime?: string;
    endTime?: string;
    unavailableDates?: string[];
    availableSundays?: string[];
};
export declare type TimeslotUpdateFormValidationValues = {
    startTime?: ValidationFunction<string>;
    endTime?: ValidationFunction<string>;
    unavailableDates?: ValidationFunction<string>;
    availableSundays?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TimeslotUpdateFormOverridesProps = {
    TimeslotUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    startTime?: PrimitiveOverrideProps<TextFieldProps>;
    endTime?: PrimitiveOverrideProps<TextFieldProps>;
    unavailableDates?: PrimitiveOverrideProps<TextFieldProps>;
    availableSundays?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TimeslotUpdateFormProps = React.PropsWithChildren<{
    overrides?: TimeslotUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    timeslot?: Timeslot;
    onSubmit?: (fields: TimeslotUpdateFormInputValues) => TimeslotUpdateFormInputValues;
    onSuccess?: (fields: TimeslotUpdateFormInputValues) => void;
    onError?: (fields: TimeslotUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TimeslotUpdateFormInputValues) => TimeslotUpdateFormInputValues;
    onValidate?: TimeslotUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TimeslotUpdateForm(props: TimeslotUpdateFormProps): React.ReactElement;

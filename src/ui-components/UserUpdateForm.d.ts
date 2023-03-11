/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { User } from "../models";
export declare type ValidationResponse = {
  hasError: boolean;
  errorMessage?: string;
};
export declare type ValidationFunction<T> = (
  value: T,
  validationResponse: ValidationResponse
) => ValidationResponse | Promise<ValidationResponse>;
export declare type UserUpdateFormInputValues = {
  userName?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
};
export declare type UserUpdateFormValidationValues = {
  userName?: ValidationFunction<string>;
  firstName?: ValidationFunction<string>;
  lastName?: ValidationFunction<string>;
  userType?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> &
  React.DOMAttributes<HTMLDivElement>;
export declare type UserUpdateFormOverridesProps = {
  UserUpdateFormGrid?: FormProps<GridProps>;
  userName?: FormProps<TextFieldProps>;
  firstName?: FormProps<TextFieldProps>;
  lastName?: FormProps<TextFieldProps>;
  userType?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type UserUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: UserUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    user?: User;
    onSubmit?: (fields: UserUpdateFormInputValues) => UserUpdateFormInputValues;
    onSuccess?: (fields: UserUpdateFormInputValues) => void;
    onError?: (fields: UserUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserUpdateFormInputValues) => UserUpdateFormInputValues;
    onValidate?: UserUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function UserUpdateForm(
  props: UserUpdateFormProps
): React.ReactElement;

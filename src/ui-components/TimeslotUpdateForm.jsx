/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Timeslot } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function TimeslotUpdateForm(props) {
  const {
    id: idProp,
    timeslot,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    startTime: "",
    endTime: "",
    eventId: "",
    available: false,
  };
  const [startTime, setStartTime] = React.useState(initialValues.startTime);
  const [endTime, setEndTime] = React.useState(initialValues.endTime);
  const [eventId, setEventId] = React.useState(initialValues.eventId);
  const [available, setAvailable] = React.useState(initialValues.available);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = timeslotRecord
      ? { ...initialValues, ...timeslotRecord }
      : initialValues;
    setStartTime(cleanValues.startTime);
    setEndTime(cleanValues.endTime);
    setEventId(cleanValues.eventId);
    setAvailable(cleanValues.available);
    setErrors({});
  };
  const [timeslotRecord, setTimeslotRecord] = React.useState(timeslot);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Timeslot, idProp)
        : timeslot;
      setTimeslotRecord(record);
    };
    queryData();
  }, [idProp, timeslot]);
  React.useEffect(resetStateValues, [timeslotRecord]);
  const validations = {
    startTime: [],
    endTime: [],
    eventId: [],
    available: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value = getDisplayValue
      ? getDisplayValue(currentValue)
      : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          startTime,
          endTime,
          eventId,
          available,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(
            Timeslot.copyOf(timeslotRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "TimeslotUpdateForm")}
      {...rest}
    >
      <TextField
        label="Start time"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={startTime}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              startTime: value,
              endTime,
              eventId,
              available,
            };
            const result = onChange(modelFields);
            value = result?.startTime ?? value;
          }
          if (errors.startTime?.hasError) {
            runValidationTasks("startTime", value);
          }
          setStartTime(value);
        }}
        onBlur={() => runValidationTasks("startTime", startTime)}
        errorMessage={errors.startTime?.errorMessage}
        hasError={errors.startTime?.hasError}
        {...getOverrideProps(overrides, "startTime")}
      ></TextField>
      <TextField
        label="End time"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={endTime}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              startTime,
              endTime: value,
              eventId,
              available,
            };
            const result = onChange(modelFields);
            value = result?.endTime ?? value;
          }
          if (errors.endTime?.hasError) {
            runValidationTasks("endTime", value);
          }
          setEndTime(value);
        }}
        onBlur={() => runValidationTasks("endTime", endTime)}
        errorMessage={errors.endTime?.errorMessage}
        hasError={errors.endTime?.hasError}
        {...getOverrideProps(overrides, "endTime")}
      ></TextField>
      <TextField
        label="Event id"
        isRequired={false}
        isReadOnly={false}
        value={eventId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              startTime,
              endTime,
              eventId: value,
              available,
            };
            const result = onChange(modelFields);
            value = result?.eventId ?? value;
          }
          if (errors.eventId?.hasError) {
            runValidationTasks("eventId", value);
          }
          setEventId(value);
        }}
        onBlur={() => runValidationTasks("eventId", eventId)}
        errorMessage={errors.eventId?.errorMessage}
        hasError={errors.eventId?.hasError}
        {...getOverrideProps(overrides, "eventId")}
      ></TextField>
      <SwitchField
        label="Available"
        defaultChecked={false}
        isDisabled={false}
        isChecked={available}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              startTime,
              endTime,
              eventId,
              available: value,
            };
            const result = onChange(modelFields);
            value = result?.available ?? value;
          }
          if (errors.available?.hasError) {
            runValidationTasks("available", value);
          }
          setAvailable(value);
        }}
        onBlur={() => runValidationTasks("available", available)}
        errorMessage={errors.available?.errorMessage}
        hasError={errors.available?.hasError}
        {...getOverrideProps(overrides, "available")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || timeslot)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || timeslot) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}

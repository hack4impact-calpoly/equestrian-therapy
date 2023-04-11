/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { fetchByPath, validateField } from "./utils";
import { Timeslot } from "../models";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { DataStore } from "aws-amplify";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
}) {
  const { tokens } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    if (
      (currentFieldValue !== undefined ||
        currentFieldValue !== null ||
        currentFieldValue !== "") &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  return (
    <React.Fragment>
      {isEditing && children}
      {!isEditing ? (
        <>
          <Text>{label}</Text>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button
            size="small"
            variation="link"
            color={tokens.colors.brand.primary[80]}
            isDisabled={hasError}
            onClick={addItem}
          >
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
}
export default function TimeslotCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onCancel,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    startTime: undefined,
    endTime: undefined,
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [],
  };
  const [startTime, setStartTime] = React.useState(initialValues.startTime);
  const [endTime, setEndTime] = React.useState(initialValues.endTime);
  const [unavailableDates, setUnavailableDates] = React.useState(
    initialValues.unavailableDates
  );
  const [volunteerBookings, setVolunteerBookings] = React.useState(
    initialValues.volunteerBookings
  );
  const [riderBookings, setRiderBookings] = React.useState(
    initialValues.riderBookings
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setStartTime(initialValues.startTime);
    setEndTime(initialValues.endTime);
    setUnavailableDates(initialValues.unavailableDates);
    setCurrentUnavailableDatesValue(undefined);
    setVolunteerBookings(initialValues.volunteerBookings);
    setCurrentVolunteerBookingsValue(undefined);
    setRiderBookings(initialValues.riderBookings);
    setCurrentRiderBookingsValue(undefined);
    setErrors({});
  };
  const [currentUnavailableDatesValue, setCurrentUnavailableDatesValue] =
    React.useState(undefined);
  const unavailableDatesRef = React.createRef();
  const [currentVolunteerBookingsValue, setCurrentVolunteerBookingsValue] =
    React.useState(undefined);
  const volunteerBookingsRef = React.createRef();
  const [currentRiderBookingsValue, setCurrentRiderBookingsValue] =
    React.useState(undefined);
  const riderBookingsRef = React.createRef();
  const validations = {
    startTime: [],
    endTime: [],
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [],
  };
  const runValidationTasks = async (fieldName, value) => {
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
          unavailableDates,
          volunteerBookings,
          riderBookings,
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
          await DataStore.save(new Timeslot(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...rest}
      {...getOverrideProps(overrides, "TimeslotCreateForm")}
    >
      <TextField
        label="Start time"
        isRequired={false}
        isReadOnly={false}
        type="time"
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              startTime: value,
              endTime,
              unavailableDates,
              volunteerBookings,
              riderBookings,
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
        type="time"
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              startTime,
              endTime: value,
              unavailableDates,
              volunteerBookings,
              riderBookings,
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
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              startTime,
              endTime,
              unavailableDates: values,
              volunteerBookings,
              riderBookings,
            };
            const result = onChange(modelFields);
            values = result?.unavailableDates ?? values;
          }
          setUnavailableDates(values);
          setCurrentUnavailableDatesValue(undefined);
        }}
        currentFieldValue={currentUnavailableDatesValue}
        label={"Unavailable dates"}
        items={unavailableDates}
        hasError={errors.unavailableDates?.hasError}
        setFieldValue={setCurrentUnavailableDatesValue}
        inputFieldRef={unavailableDatesRef}
        defaultFieldValue={undefined}
      >
        <TextField
          label="Unavailable dates"
          isRequired={false}
          isReadOnly={false}
          type="date"
          value={currentUnavailableDatesValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.unavailableDates?.hasError) {
              runValidationTasks("unavailableDates", value);
            }
            setCurrentUnavailableDatesValue(value);
          }}
          onBlur={() =>
            runValidationTasks("unavailableDates", currentUnavailableDatesValue)
          }
          errorMessage={errors.unavailableDates?.errorMessage}
          hasError={errors.unavailableDates?.hasError}
          ref={unavailableDatesRef}
          {...getOverrideProps(overrides, "unavailableDates")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              startTime,
              endTime,
              unavailableDates,
              volunteerBookings: values,
              riderBookings,
            };
            const result = onChange(modelFields);
            values = result?.volunteerBookings ?? values;
          }
          setVolunteerBookings(values);
          setCurrentVolunteerBookingsValue(undefined);
        }}
        currentFieldValue={currentVolunteerBookingsValue}
        label={"Volunteer bookings"}
        items={volunteerBookings}
        hasError={errors.volunteerBookings?.hasError}
        setFieldValue={setCurrentVolunteerBookingsValue}
        inputFieldRef={volunteerBookingsRef}
        defaultFieldValue={undefined}
      >
        <TextField
          label="Volunteer bookings"
          isRequired={false}
          isReadOnly={false}
          value={currentVolunteerBookingsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.volunteerBookings?.hasError) {
              runValidationTasks("volunteerBookings", value);
            }
            setCurrentVolunteerBookingsValue(value);
          }}
          onBlur={() =>
            runValidationTasks(
              "volunteerBookings",
              currentVolunteerBookingsValue
            )
          }
          errorMessage={errors.volunteerBookings?.errorMessage}
          hasError={errors.volunteerBookings?.hasError}
          ref={volunteerBookingsRef}
          {...getOverrideProps(overrides, "volunteerBookings")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              startTime,
              endTime,
              unavailableDates,
              volunteerBookings,
              riderBookings: values,
            };
            const result = onChange(modelFields);
            values = result?.riderBookings ?? values;
          }
          setRiderBookings(values);
          setCurrentRiderBookingsValue(undefined);
        }}
        currentFieldValue={currentRiderBookingsValue}
        label={"Rider bookings"}
        items={riderBookings}
        hasError={errors.riderBookings?.hasError}
        setFieldValue={setCurrentRiderBookingsValue}
        inputFieldRef={riderBookingsRef}
        defaultFieldValue={undefined}
      >
        <TextField
          label="Rider bookings"
          isRequired={false}
          isReadOnly={false}
          value={currentRiderBookingsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.riderBookings?.hasError) {
              runValidationTasks("riderBookings", value);
            }
            setCurrentRiderBookingsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("riderBookings", currentRiderBookingsValue)
          }
          errorMessage={errors.riderBookings?.errorMessage}
          hasError={errors.riderBookings?.hasError}
          ref={riderBookingsRef}
          {...getOverrideProps(overrides, "riderBookings")}
        ></TextField>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={resetStateValues}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Cancel"
            type="button"
            onClick={() => {
              onCancel && onCancel();
            }}
            {...getOverrideProps(overrides, "CancelButton")}
          ></Button>
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}

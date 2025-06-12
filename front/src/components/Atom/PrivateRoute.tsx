import React, { ComponentType } from "react";
import { useAtom } from "jotai";
import { Navigate } from "react-router-dom";
import { User, userAtom } from "./UserAtom";

type Condition = {
  field: keyof User;
  allowedValues: (string | boolean | null)[];
};

interface ProtectedRouteProps {
  component: ComponentType<unknown>;
  conditionsEvery?: Condition[];
  conditionsSome?: Condition[];
  [key: string]: unknown;
}

export const PrivateRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  conditionsEvery = [],
  conditionsSome = [],
  ...rest
}) => {
  const [user] = useAtom(userAtom);

  const allConditionsOk = conditionsEvery.every((condition) => {
    const userValue = user[condition.field];
    const convertedUserValue =
      typeof userValue !== "boolean" ? String(userValue) : userValue;
    const convertedAllowedValues = condition.allowedValues.map((value) =>
      typeof value !== "boolean" ? String(value) : value
    );
    const isIncluded = convertedAllowedValues.some(
      (allowedValue) => allowedValue === convertedUserValue
    );
    return isIncluded;
  });

  const someConditionOk =
    conditionsSome.length === 0 ||
    conditionsSome.some((condition) => {
      const userValue = user[condition.field];
      const convertedUserValue =
        typeof userValue !== "boolean" ? String(userValue) : userValue;
      return condition.allowedValues.some(
        (value) =>
          (typeof value !== "boolean" ? String(value) : value) ===
          convertedUserValue
      );
    });

  if (!allConditionsOk || !someConditionOk) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component {...rest} />;
};

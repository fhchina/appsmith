import React from "react";
import styled from "constants/DefaultTheme";
import { Classes } from "components/ads/common";
import Text, { TextType } from "components/ads/Text";
import { Colors } from "constants/Colors";
import Icon, { IconSize } from "components/ads/Icon";
import { useSelector } from "react-redux";
import {
  getGitStatus,
  getIsFetchingGitStatus,
} from "selectors/gitSyncSelectors";
import { GitStatusData } from "reducers/uiReducers/gitSyncReducer";

const DummyChange = styled.div`
  width: 50%;
  height: ${(props) => props.theme.spaces[9]}px;
  background: linear-gradient(
    90deg,
    ${Colors.GREY_2} 0%,
    rgba(240, 240, 240, 0) 100%
  );
  margin-top: ${(props) => props.theme.spaces[7]}px;
  margin-bottom: ${(props) => props.theme.spaces[7]}px;
`;

const Wrapper = styled.div`
  height: ${(props) => props.theme.spaces[9]}px;
  margin-bottom: ${(props) => props.theme.spaces[7]}px;
  display: flex;

  .${Classes.ICON} {
    margin-right: ${(props) => props.theme.spaces[3]}px;
  }

  .${Classes.TEXT} {
    padding-top: ${(props) => props.theme.spaces[1] - 2}px;
  }
`;

const Changes = styled.div`
  margin-top: ${(props) => props.theme.spaces[7]}px;
  margin-bottom: ${(props) => props.theme.spaces[11]}px;
`;

export enum Kind {
  COMMIT = "COMMIT",
  DATA_SOURCE = "DATA_SOURCE",
  JS_OBJECT = "JS_OBJECT",
  PAGE = "PAGE",
  QUERY = "QUERY",
}

type StatusProps = {
  iconName: string;
  message: string;
  hasValue: boolean;
};

type StatusMap = {
  [key in Kind]: (status: GitStatusData) => StatusProps;
};

const STATUS_MAP: StatusMap = {
  [Kind.COMMIT]: (status: GitStatusData) => ({
    message: commitMessage(status),
    iconName: "git-commit",
    hasValue: (status?.aheadCount || 0) > 0 || (status?.behindCount || 0) > 0,
  }),
  [Kind.DATA_SOURCE]: (status: GitStatusData) => ({
    message: `${status?.modifiedDatasources || 0} ${
      status?.modifiedDatasources || 0 ? "datasource" : "datasources"
    } modified`,
    iconName: "database-2-line",
    hasValue: (status?.modifiedDatasources || 0) > 0,
  }),
  [Kind.JS_OBJECT]: (status: GitStatusData) => ({
    message: `${status?.modifiedJSObjects || 0} JS ${
      (status?.modifiedJSObjects || 0) <= 1 ? "Object" : "Objects"
    } modified`,
    iconName: "js",
    hasValue: (status?.modifiedJSObjects || 0) > 0,
  }),
  [Kind.PAGE]: (status: GitStatusData) => ({
    message: `${status?.modifiedPages || 0} ${
      (status?.modifiedPages || 0) <= 1 ? "page" : "pages"
    } updated`,
    iconName: "widget",
    hasValue: (status?.modifiedPages || 0) > 0,
  }),
  [Kind.QUERY]: (status: GitStatusData) => ({
    message: `${status?.modifiedQueries || 0} ${
      (status?.modifiedQueries || 0) <= 1 ? "query" : "queries"
    } modified`,
    iconName: "query",
    hasValue: (status?.modifiedQueries || 0) > 0,
  }),
};

function commitMessage(status: GitStatusData) {
  const aheadCount = status?.aheadCount || 0;
  const behindCount = status?.behindCount || 0;
  const aheadMessage =
    aheadCount > 0
      ? (aheadCount || 0) === 1
        ? `${aheadCount || 0} commit ahead`
        : `${aheadCount || 0} commits ahead`
      : null;
  const behindMessage =
    behindCount > 0
      ? (behindCount || 0) === 1
        ? `${behindCount || 0} commit behind`
        : `${behindCount || 0} commits behind `
      : null;
  return [aheadMessage, behindMessage].filter((i) => i !== null).join(" and ");
}

function Change(props: Partial<StatusProps>) {
  const { iconName, message } = props;

  return (
    <Wrapper>
      <Icon name={iconName} size={IconSize.XXL} />
      <Text type={TextType.P3}>{message}</Text>
    </Wrapper>
  );
}

export default function GitChangesList() {
  const status: GitStatusData = useSelector(getGitStatus) as GitStatusData;
  const loading = useSelector(getIsFetchingGitStatus);
  const changes = [
    Kind.PAGE,
    Kind.QUERY,
    Kind.COMMIT,
    Kind.JS_OBJECT,
    Kind.DATA_SOURCE,
  ]
    .map((type: Kind) => STATUS_MAP[type](status))
    .filter((s: StatusProps) => s.hasValue)
    .map((s) => <Change {...s} key={`change-status-${s.iconName}`} />)
    .filter((s) => !!s);
  return loading ? (
    <DummyChange data-testid={"t--git-change-loading-dummy"} />
  ) : (
    <Changes data-testid={"t--git-change-statuses"}>{changes}</Changes>
  );
}

import * as React from 'react';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { GridScrollArea } from '../GridScrollArea';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridDimensions, gridDimensionsSelector } from '../../hooks/features/dimensions';
import { useGridVirtualScroller } from '../../hooks/features/virtualization/useGridVirtualScroller';
import { useGridOverlays } from '../../hooks/features/overlays/useGridOverlays';
import { GridHeaders } from '../GridHeaders';
import { GridMainContainer as Container } from './GridMainContainer';
import { GridTopContainer as TopContainer } from './GridTopContainer';
import { GridBottomContainer as BottomContainer } from './GridBottomContainer';
import { GridVirtualScrollerContent as Content } from './GridVirtualScrollerContent';
import { GridVirtualScrollerFiller as SpaceFiller } from './GridVirtualScrollerFiller';
import { GridVirtualScrollerRenderZone as RenderZone } from './GridVirtualScrollerRenderZone';
import { GridVirtualScrollbar as Scrollbar } from './GridVirtualScrollbar';
import { GridLoadingOverlayVariant } from '../GridLoadingOverlay';

type OwnerState = Pick<DataGridProcessedProps, 'classes'> & {
  dimensions: GridDimensions;
  loadingOverlayVariant: GridLoadingOverlayVariant | null;
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, dimensions, loadingOverlayVariant } = ownerState;
  const slots = {
    root: [
      'main',
      dimensions.rightPinnedWidth > 0 && 'main--hasPinnedRight',
      loadingOverlayVariant === 'skeleton' && 'main--hasSkeletonLoadingOverlay',
    ],
    scroller: ['virtualScroller', dimensions.hasScrollX && 'virtualScroller--hasScrollX'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Scroller = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScroller',
  overridesResolver: (props, styles) => {
    const { ownerState } = props;
    return [
      styles.virtualScroller,
      ownerState.dimensions.hasScrollX && styles['virtualScroller--hasScrollX'],
    ];
  },
})<{ ownerState: OwnerState }>({
  position: 'relative',
  height: '100%',
  flexGrow: 1,
  overflow: 'scroll',
  scrollbarWidth: 'none' /* Firefox */,
  display: 'flex',
  flexDirection: 'column',
  '&::-webkit-scrollbar': {
    display: 'none' /* Safari and Chrome */,
  },

  '@media print': {
    overflow: 'hidden',
  },

  // See https://github.com/mui/mui-x/issues/10547
  zIndex: 0,
});

export interface GridVirtualScrollerProps {
  children?: React.ReactNode;
}

function GridVirtualScroller(props: GridVirtualScrollerProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const { getOverlay, overlaysProps } = useGridOverlays();
  const ownerState = {
    classes: rootProps.classes,
    dimensions,
    loadingOverlayVariant: overlaysProps.loadingOverlayVariant,
  };
  const classes = useUtilityClasses(ownerState);

  const virtualScroller = useGridVirtualScroller();
  const {
    getContainerProps,
    getScrollerProps,
    getContentProps,
    getRenderZoneProps,
    getScrollbarVerticalProps,
    getScrollbarHorizontalProps,
    getRows,
  } = virtualScroller;

  const rows = getRows();

  return (
    <Container className={classes.root} {...getContainerProps()} ownerState={ownerState}>
      <GridScrollArea scrollDirection="left" />
      <GridScrollArea scrollDirection="right" />
      <Scroller className={classes.scroller} {...getScrollerProps()} ownerState={ownerState}>
        <TopContainer>
          {!rootProps.unstable_listView && <GridHeaders />}
          <rootProps.slots.pinnedRows position="top" virtualScroller={virtualScroller} />
        </TopContainer>

        {getOverlay()}

        <Content {...getContentProps()}>
          <RenderZone {...getRenderZoneProps()}>
            {rows}
            {<rootProps.slots.detailPanels virtualScroller={virtualScroller} />}
          </RenderZone>
        </Content>

        <SpaceFiller rowsLength={rows.length} />

        <BottomContainer>
          <rootProps.slots.pinnedRows position="bottom" virtualScroller={virtualScroller} />
        </BottomContainer>
      </Scroller>
      {dimensions.hasScrollX && !rootProps.unstable_listView && (
        <Scrollbar position="horizontal" {...getScrollbarHorizontalProps()} />
      )}
      {dimensions.hasScrollY && <Scrollbar position="vertical" {...getScrollbarVerticalProps()} />}
      {props.children}
    </Container>
  );
}

export { GridVirtualScroller };

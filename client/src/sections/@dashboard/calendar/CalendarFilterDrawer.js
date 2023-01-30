import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Stack,
  Drawer,
  Divider,
  Tooltip,
  TextField,
  Typography,
  IconButton,
  ListItemText,
  ListItemButton,
} from '@mui/material';
// config
import { NAV } from '../../../config-global';
// utils
import { fDateTime } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { ColorMultiPicker } from '../../../components/color-utils';

// ----------------------------------------------------------------------

CalendarFilterDrawer.propTypes = {
  open: PropTypes.bool,
  events: PropTypes.array,
  onClose: PropTypes.func,
  picker: PropTypes.object,
  onResetFilter: PropTypes.func,
  onSelectEvent: PropTypes.func,
  onFilterEventColor: PropTypes.func,
  colorOptions: PropTypes.arrayOf(PropTypes.string),
  filterEventColor: PropTypes.arrayOf(PropTypes.string),
};

export default function CalendarFilterDrawer({
  open,
  events,
  picker,
  onClose,
  onResetFilter,
  colorOptions,
  onSelectEvent,
  filterEventColor,
  onFilterEventColor,
}) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{
        invisible: true,
      }}
      PaperProps={{
        sx: { width: NAV.W_BASE },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pl: 2, pr: 1, py: 2 }}
      >
        <Typography variant="subtitle1">Filters</Typography>

        <Tooltip title="Reset">
          <IconButton onClick={onResetFilter}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Divider />

      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontWeight: 'fontWeightMedium',
          p: (theme) => theme.spacing(2, 2, 1, 2),
        }}
      >
        Colors
      </Typography>

      <ColorMultiPicker
        colors={colorOptions}
        selected={filterEventColor}
        onChangeColor={onFilterEventColor}
        sx={{ maxWidth: 36 * 4, mx: 2 }}
      />

      <Typography
        variant="caption"
        sx={{
          p: 2,
          color: 'text.secondary',
          fontWeight: 'fontWeightMedium',
        }}
      >
        Range
      </Typography>

      <Stack spacing={2} sx={{ px: 2 }}>
        <DatePicker
          label="Start date"
          value={picker.startDate}
          onChange={picker.onChangeStartDate}
          renderInput={(params) => <TextField size="small" {...params} />}
        />

        <DatePicker
          label="End date"
          value={picker.endDate}
          onChange={picker.onChangeEndDate}
          renderInput={(params) => <TextField size="small" {...params} />}
        />
      </Stack>

      <Typography
        variant="caption"
        sx={{
          p: 2,
          color: 'text.secondary',
          fontWeight: 'fontWeightMedium',
        }}
      >
        Events ({events.length})
      </Typography>

      <Scrollbar sx={{ height: 1 }}>
        {orderBy(events, ['end'], ['desc']).map((event) => (
          <ListItemButton key={event.id} onClick={() => onSelectEvent(event.id)}>
            <Box
              sx={{
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                position: 'absolute',
                borderRight: '8px solid transparent',
                borderTop: `8px solid ${event.textColor}`,
              }}
            />

            <ListItemText
              disableTypography
              primary={
                <Typography variant="subtitle2" sx={{ fontSize: 13, mt: 0.5 }}>
                  {event.title}
                </Typography>
              }
              secondary={
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ fontSize: 11, color: 'text.disabled' }}
                >
                  {event.allDay ? (
                    fDateTime(event.start, 'dd MMM yy')
                  ) : (
                    <>
                      {fDateTime(event.start, 'dd MMM yy p')} {' - '}
                      {fDateTime(event.end, 'dd MMM yy p')}
                    </>
                  )}
                </Typography>
              }
              sx={{ display: 'flex', flexDirection: 'column-reverse' }}
            />
          </ListItemButton>
        ))}
      </Scrollbar>
    </Drawer>
  );
}

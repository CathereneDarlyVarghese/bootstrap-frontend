import { StatusTypes } from 'enums';

const useStatusTypeNames = () => ({
  [StatusTypes.WORKING]: 'Working',
  [StatusTypes.DOWN]: 'Not Working',
  [StatusTypes.MAINTENANCE]: 'Needs Maintenance',
});

export default useStatusTypeNames;

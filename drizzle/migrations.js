// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_fluffy_grim_reaper.sql';
import m0001 from './0001_sharp_molecule_man.sql';
import m0002 from './0002_narrow_strong_guy.sql';
import m0003 from './0003_pretty_vapor.sql';
import m0004 from './0004_white_lilith.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004
    }
  }
  
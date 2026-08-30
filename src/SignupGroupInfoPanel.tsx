import type { PublicSignupGroup } from './lib/signup-groups';

type SignupGroupInfoPanelProps = {
  group: PublicSignupGroup | undefined;
  className?: string;
};

export function SignupGroupInfoPanel({ group, className = '' }: SignupGroupInfoPanelProps) {
  if (!group || (!group.description && !group.info)) {
    return null;
  }

  return (
    <aside
      className={`signup-group-info ${className}`.trim()}
      aria-label={`Information om ${group.name}`}
    >
      {group.description ? <p className="signup-group-info-desc">{group.description}</p> : null}
      {group.info ? <p className="signup-group-info-extra">{group.info}</p> : null}
    </aside>
  );
}

export class SkillError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function publicError(error) {
  return error instanceof SkillError
    ? { code: error.code, message: error.message }
    : { code: 'INTERNAL_ERROR', message: 'Skill invocation failed.' };
}

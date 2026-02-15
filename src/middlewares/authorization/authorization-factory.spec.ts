/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccessProfile } from "@/shared/constants/accessProfile";
import { AuthorizationFactory } from "./authorization-factory";

describe("Unit test - AuthorizationFactory", () => {
  const buildReq = (role?: AccessProfile) => ({ user: role ? { role } : undefined }) as any;

  it("should not leak anyRole state into role-based middleware", () => {
    const factory = new AuthorizationFactory();

    const adminOnly = factory.ofRoles([AccessProfile.ADMIN]);
    factory.anyRole();

    const next = jest.fn();
    adminOnly.authorize(buildReq(AccessProfile.CLIENT), {} as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    const [firstArg] = next.mock.calls[0];
    expect(firstArg).toBeInstanceOf(Error);
    expect(firstArg.name).toBe("ForbiddenException");
  });

  it("should allow admin user on admin middleware", () => {
    const factory = new AuthorizationFactory();
    const adminOnly = factory.ofRoles([AccessProfile.ADMIN]);

    const next = jest.fn();
    adminOnly.authorize(buildReq(AccessProfile.ADMIN), {} as any, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should deny request without role", () => {
    const factory = new AuthorizationFactory();
    const anyRole = factory.anyRole();

    const next = jest.fn();
    anyRole.authorize(buildReq(), {} as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    const [firstArg] = next.mock.calls[0];
    expect(firstArg).toBeInstanceOf(Error);
    expect(firstArg.name).toBe("ForbiddenException");
  });
});

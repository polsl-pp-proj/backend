import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { OrganizationDto } from '../dtos/organization.dto';
import { validationConfig } from 'src/configs/validation.config';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { AddMemberDto } from '../dtos/add-member.dto';
import { IOrganizationService } from '../interfaces/organization.service.intarface';
import { AuthTokenPayload } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';

@Controller({ path: 'org', version: '1' })
export class OrganizationControllerController {
    constructor(private readonly organizationService: IOrganizationService) {}
    @Get()
    async getAllOrganizations(): Promise<OrganizationDto[]> {
        return await this.organizationService.getAllOrganizations();
    }

    @Get(':organizationId')
    async getOrganizationById(
        @Param('organizationId', ParseIntPipe) organizationId: number,
    ): Promise<OrganizationDto> {
        return await this.organizationService.getOrganizationById(
            organizationId,
        );
    }

    @Post()
    async createOrganization(
        @AuthTokenPayload() organizationOwner: AuthTokenPayloadDto,
        @Body(new ValidationPipe(validationConfig))
        createOrganizationDto: CreateOrganizationDto,
    ): Promise<void> {
        await this.organizationService.createOrganization(
            organizationOwner,
            createOrganizationDto,
        );
    }

    @Post('member/:organizationId')
    async addOrganizationMembers(
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @Body(new ValidationPipe(validationConfig))
        addMemberDto: AddMemberDto[],
    ): Promise<void> {
        await this.organizationService.addMembers(organizationId, addMemberDto);
    }

    @Delete('member/:organizationId')
    async deleteOrganizationMember(
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @Body(new ValidationPipe(validationConfig)) memberId: number,
    ): Promise<void> {
        await this.organizationService.deleteMember(organizationId, memberId);
    }
}

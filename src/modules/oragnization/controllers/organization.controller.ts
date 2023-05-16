import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotImplementedException,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { OrganizationDto } from '../dtos/organization.dto';
import { validationConfig } from 'src/configs/validation.config';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { IOrganizationService } from '../../../interfaces/organization.service.interface';
import { AuthTokenPayload } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { AddMembersDto } from '../dtos/add-members.dto';
import { RemoveMembersDto } from '../dtos/remove-members.dto';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';

@Controller({ path: 'organization', version: '1' })
export class OrganizationController {
    constructor(private readonly organizationService: IOrganizationService) {}
    @Get()
    async getAllOrganizations(): Promise<OrganizationDto[]> {
        return await this.organizationService.getAllOrganizations();
    }

    @Get('own')
    @UseGuards(AuthTokenGuard)
    async getOwnOrganizations(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<OrganizationDto> {
        throw new NotImplementedException();
    }

    @Get(':organizationId/full')
    @UseGuards(AuthTokenGuard)
    async getOwnOrganizationById(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Param('organizationId', ParseIntPipe) organizationId: number,
    ): Promise<OrganizationDto> {
        return await this.organizationService.getFullOrganizationById(
            user.userId,
            organizationId,
        );
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
    @UseGuards(AuthTokenGuard)
    async createOrganization(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Body(new ValidationPipe(validationConfig))
        createOrganizationDto: CreateOrganizationDto,
    ): Promise<void> {
        if (user.isVerifiedStudent) {
            await this.organizationService.createOrganization(
                user.userId,
                createOrganizationDto,
            );
            return;
        }
        throw new ForbiddenException('user_not_student');
    }

    @Post(':organizationId/member')
    @UseGuards(AuthTokenGuard)
    async addOrganizationMembers(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @Body(new ValidationPipe(validationConfig))
        addMembersDto: AddMembersDto,
    ): Promise<void> {
        await this.organizationService.addMembers(
            user.userId,
            organizationId,
            addMembersDto,
        );
    }

    @Delete(':organizationId/member')
    @UseGuards(AuthTokenGuard)
    async deleteOrganizationMembers(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @Body(new ValidationPipe(validationConfig))
        removeMembersDto: RemoveMembersDto,
    ): Promise<void> {
        await this.organizationService.removeMembers(
            user.userId,
            organizationId,
            removeMembersDto,
        );
    }
}

/*
 * Auto generated using https://github.com/ritz078/transform
 * The EVE JSON schema used was took from https://github.com/OISF/suricata/blob/main/etc/schema.json for Suricata 8
 */

export type DnsAdditionals = [
	{
		opt?: [
			{
				code?: number;
				data?: string;
			},
			...{
				code?: number;
				data?: string;
			}[]
		];
		rdata?: string;
		rrname?: string;
		rrtype?: string;
		ttl?: number;
	},
	...{
		opt?: [
			{
				code?: number;
				data?: string;
			},
			...{
				code?: number;
				data?: string;
			}[]
		];
		rdata?: string;
		rrname?: string;
		rrtype?: string;
		ttl?: number;
	}[]
];
export type DnsAuthorities = [
	{
		rdata?: string;
		/**
		 * Set to true if the rdata was too long and truncated by Suricata
		 */
		rdata_truncated?: boolean;
		rrname?: string;
		/**
		 * Set to true if the rrname was too long and truncated by Suricata
		 */
		rrname_truncated?: boolean;
		rrtype?: string;
		soa?: DnsSoa;
		ttl?: number;
	},
	...{
		rdata?: string;
		/**
		 * Set to true if the rdata was too long and truncated by Suricata
		 */
		rdata_truncated?: boolean;
		rrname?: string;
		/**
		 * Set to true if the rrname was too long and truncated by Suricata
		 */
		rrname_truncated?: boolean;
		rrtype?: string;
		soa?: DnsSoa;
		ttl?: number;
	}[]
];
export type AuthoritativeAnswer = 'aa';
export type Truncated = 'tc';
export type RecursionDesired = 'rd';
export type RecursionAvailable = 'ra';
export type ZReserved = 'z';
export type AuthenticData = 'ad';
export type CheckingDisabled = 'cd';

export interface HTTPEvent {
		content_range?: {
			/**
			 * Range end in Content-Range header
			 */
			end?: number;
			/**
			 * Raw Content-Range header
			 */
			raw?: string;
			/**
			 * Total length of document in Content-Range header
			 */
			size?: number;
			/**
			 * Range start in Content-Range header
			 */
			start?: number;
		};
		/**
		 * The domain name of the server, the Host header
		 */
		hostname?: string;
		http2?: {
			request?: {
				error_code?: string;
				has_multiple?: string;
				priority?: number;
				settings?: [
					{
						settings_id?: string;
						settings_value?: number;
					},
					...{
						settings_id?: string;
						settings_value?: number;
					}[]
				];
			};
			response?: {
				error_code?: string;
				has_multiple?: string;
				settings?: [
					{
						settings_id?: string;
						settings_value?: number;
					},
					...{
						settings_id?: string;
						settings_value?: number;
					}[]
				];
			};
			stream_id?: number;
		};
		/**
		 * The media type of the resource or data, the Content-Type header
		 */
		http_content_type?: string;
		/**
		 * The HTTP request method
		 */
		http_method?: string;
		/**
		 * The port in the Host header if any
		 */
		http_port?: number;
		/**
		 * An absolute or partial address of the web page that makes the request, the Referer header
		 */
		http_refer?: string;
		/**
		 * Base64 of the request body
		 */
		http_request_body?: string;
		/**
		 * The ascii-printable characters of the request body
		 */
		http_request_body_printable?: string;
		/**
		 * Base64 of the response body
		 */
		http_response_body?: string;
		/**
		 * The ascii-printable characters of the response body
		 */
		http_response_body_printable?: string;
		/**
		 * A characteristic string that lets servers and network peers identify the application, operating system, vendor, and/or version of the requesting user agent, the User-Agent header
		 */
		http_user_agent?: string;
		/**
		 * The response message length
		 */
		length?: number;
		/**
		 * The HTTP protocol with its version
		 */
		protocol?: string;
		/**
		 * The URL to redirect a page to, the Location header
		 */
		redirect?: string;
		request_headers?: [
			{
				name?: string;
				table_size_update?: number;
				value?: string;
			},
			...{
				name?: string;
				table_size_update?: number;
				value?: string;
			}[]
		];
		response_headers?: [
			{
				name?: string;
				table_size_update?: number;
				value?: string;
			},
			...{
				name?: string;
				table_size_update?: number;
				value?: string;
			}[]
		];
		/**
		 * Status as integer value
		 */
		status?: number;
		/**
		 * Status string when it is not a valid integer (like 2XX)
		 */
		status_string?: string;
		/**
		 * The HTTP request URI
		 */
		url?: string;
		/**
		 * HTTP major version : 2 when HTTP/2 is used
		 */
		version?: string;
		/**
		 * A de-facto standard header for identifying the originating IP address of a client connecting to a web server through a proxy server, the X-Forwarded-For header request header
		 */
		xff?: string;
};

export interface ARPEvent {
		/**
		 * Logical address of the intended receiver
		 */
		dest_ip?: string;
		/**
		 * Physical address of the intended receiver
		 */
		dest_mac?: string;
		/**
		 * Network link protocol type
		 */
		hw_type?: string;
		/**
		 * Specifies the operation that the sender is performing
		 */
		opcode?: string;
		/**
		 * Internetwork protocol for which the ARP request is intended
		 */
		proto_type?: string;
		/**
		 * Logical address of the sender
		 */
		src_ip?: string;
		/**
		 * Physical address of the sender
		 */
		src_mac?: string;
};

export interface BitTorrentDHTEvent {
		client_version?: string;
		error?: {
			msg?: string;
			num?: number;
		};
		request?: {
			id?: string;
			implied_port?: number;
			info_hash?: string;
			port?: number;
			target?: string;
			token?: string;
		};
		request_type?: string;
		response?: {
			id: string;
			nodes?: {
				id: string;
				ip: string;
				port: number;
			}[];
			nodes6?: {
				id: string;
				ip: string;
				port: number;
			}[];
			token?: string;
			values?: {
				ip?: string;
				port?: number;
			}[];
		};
		transaction_id?: string;
};

export interface DCERPCEvent {
		activityuuid?: string;
		call_id?: number;
		interfaces?: [
			{
				ack_result?: number;
				uuid?: string;
				version?: string;
			},
			...{
				ack_result?: number;
				uuid?: string;
				version?: string;
			}[]
		];
		req?: {
			frag_cnt?: number;
			opnum?: number;
			stub_data_size?: number;
		};
		request?: string;
		res?: {
			frag_cnt?: number;
			stub_data_size?: number;
		};
		response?: string;
		rpc_version?: string;
		seqnum?: number;
};

export interface DHCPEvent {
		assigned_ip?: string;
		client_id?: string;
		client_ip?: string;
		client_mac?: string;
		dhcp_type?: string;
		dns_servers?: [string, ...string[]];
		hostname?: string;
		id?: number;
		lease_time?: number;
		next_server_ip?: string;
		params?: [string, ...string[]];
		rebinding_time?: number;
		relay_ip?: string;
		renewal_time?: number;
		requested_ip?: string;
		routers?: [string, ...string[]];
		subnet_mask?: string;
		type?: string;
		vendor_class_identifier?: string;
};

export interface DNP3Event {
		application?: {
			complete?: boolean;
			control?: {
				con?: boolean;
				fin?: boolean;
				fir?: boolean;
				sequence?: number;
				uns?: boolean;
			};
			function_code?: number;
			objects?: [
				{
					count?: number;
					group?: number;
					points?: [
						{
							[k: string]: unknown;
						},
						...{
							[k: string]: unknown;
						}[]
					];
					prefix_code?: number;
					qualifier?: number;
					range_code?: number;
					start?: number;
					stop?: number;
					variation?: number;
				},
				...{
					count?: number;
					group?: number;
					points?: [
						{
							[k: string]: unknown;
						},
						...{
							[k: string]: unknown;
						}[]
					];
					prefix_code?: number;
					qualifier?: number;
					range_code?: number;
					start?: number;
					stop?: number;
					variation?: number;
				}[]
			];
		};
		control?: {
			dir?: boolean;
			fcb?: boolean;
			fcv?: boolean;
			function_code?: number;
			pri?: boolean;
		};
		dst?: number;
		iin?: {
			indicators?: [string, ...string[]];
		};
		request?: {
			application?: {
				complete?: boolean;
				control?: {
					con?: boolean;
					fin?: boolean;
					fir?: boolean;
					sequence?: number;
					uns?: boolean;
				};
				function_code?: number;
				objects?: [
					{
						count?: number;
						group?: number;
						points?: [
							{
								[k: string]: unknown;
							},
							...{
								[k: string]: unknown;
							}[]
						];
						prefix_code?: number;
						qualifier?: number;
						range_code?: number;
						start?: number;
						stop?: number;
						variation?: number;
					},
					...{
						count?: number;
						group?: number;
						points?: [
							{
								[k: string]: unknown;
							},
							...{
								[k: string]: unknown;
							}[]
						];
						prefix_code?: number;
						qualifier?: number;
						range_code?: number;
						start?: number;
						stop?: number;
						variation?: number;
					}[]
				];
			};
			control?: {
				dir?: boolean;
				fcb?: boolean;
				fcv?: boolean;
				function_code?: number;
				pri?: boolean;
			};
			dst?: number;
			src?: number;
			type?: string;
		};
		response?: {
			application?: {
				complete?: boolean;
				control?: {
					con?: boolean;
					fin?: boolean;
					fir?: boolean;
					sequence?: number;
					uns?: boolean;
				};
				function_code?: number;
				objects?: [
					{
						count?: number;
						group?: number;
						points?: [
							{
								[k: string]: unknown;
							},
							...{
								[k: string]: unknown;
							}[]
						];
						prefix_code?: number;
						qualifier?: number;
						range_code?: number;
						start?: number;
						stop?: number;
						variation?: number;
					},
					...{
						count?: number;
						group?: number;
						points?: [
							{
								[k: string]: unknown;
							},
							...{
								[k: string]: unknown;
							}[]
						];
						prefix_code?: number;
						qualifier?: number;
						range_code?: number;
						start?: number;
						stop?: number;
						variation?: number;
					}[]
				];
			};
			control?: {
				dir?: boolean;
				fcb?: boolean;
				fcv?: boolean;
				function_code?: number;
				pri?: boolean;
			};
			dst?: number;
			iin?: {
				indicators?: [string, ...string[]];
			};
			src?: number;
			type?: string;
		};
		src?: number;
		type?: string;
};

export interface DNSEvent {
		aa?: boolean;
		additionals?: DnsAdditionals;
		answer?: {
			additionals?: DnsAdditionals;
			authorities?: DnsAuthorities;
			flags?: string;
			id?: number;
			/**
			 * DNS opcode as an integer
			 */
			opcode?: number;
			qr?: boolean;
			ra?: boolean;
			rcode?: string;
			rd?: boolean;
			rrname?: string;
			rrtype?: string;
			type?: string;
			version?: number;
		};
		answers?: [
			{
				rdata?: string;
				rrname?: string;
				rrtype?: string;
				soa?: DnsSoa;
				srv?: {
					name?: string;
					port?: number;
					priority?: number;
					weight?: number;
				};
				/**
				 * A Secure Shell fingerprint, used to verify the system’s authenticity
				 */
				sshfp?: {
					algo?: number;
					fingerprint?: string;
					type?: number;
				};
				ttl?: number;
			},
			...{
				rdata?: string;
				rrname?: string;
				rrtype?: string;
				soa?: DnsSoa;
				srv?: {
					name?: string;
					port?: number;
					priority?: number;
					weight?: number;
				};
				/**
				 * A Secure Shell fingerprint, used to verify the system’s authenticity
				 */
				sshfp?: {
					algo?: number;
					fingerprint?: string;
					type?: number;
				};
				ttl?: number;
			}[]
		];
		authorities?: DnsAuthorities;
		flags?: string;
		grouped?: {
			A?: [string, ...string[]];
			AAAA?: [string, ...string[]];
			CNAME?: [string, ...string[]];
			MX?: [string, ...string[]];
			NS?: [string, ...string[]];
			NULL?: [string, ...string[]];
			PTR?: [string, ...string[]];
			SOA?: [DnsSoa, ...DnsSoa[]];
			SRV?: [
				{
					name?: string;
					port?: number;
					priority?: number;
					weight?: number;
				},
				...{
					name?: string;
					port?: number;
					priority?: number;
					weight?: number;
				}[]
			];
			/**
			 * A Secure Shell fingerprint is used to verify the system’s authenticity
			 */
			SSHFP?: [
				{
					algo?: number;
					fingerprint?: string;
					type?: number;
				},
				...{
					algo?: number;
					fingerprint?: string;
					type?: number;
				}[]
			];
			TXT?: [string, ...string[]];
		};
		id?: number;
		/**
		 * DNS opcode as an integer
		 */
		opcode?: number;
		qr?: boolean;
		queries?: [
			{
				id?: number;
				/**
				 * DNS opcode as an integer
				 */
				opcode?: number;
				rrname?: string;
				/**
				 * Set to true if the rrname was too long and truncated by Suricata
				 */
				rrname_truncated?: boolean;
				rrtype?: string;
				tx_id?: number;
				type?: string;
				z?: boolean;
			},
			...{
				id?: number;
				/**
				 * DNS opcode as an integer
				 */
				opcode?: number;
				rrname?: string;
				/**
				 * Set to true if the rrname was too long and truncated by Suricata
				 */
				rrname_truncated?: boolean;
				rrtype?: string;
				tx_id?: number;
				type?: string;
				z?: boolean;
			}[]
		];
		query?: [
			{
				id?: number;
				/**
				 * DNS opcode as an integer
				 */
				opcode?: number;
				rrname?: string;
				rrtype?: string;
				tx_id?: number;
				type?: string;
				z?: boolean;
			},
			...{
				id?: number;
				/**
				 * DNS opcode as an integer
				 */
				opcode?: number;
				rrname?: string;
				rrtype?: string;
				tx_id?: number;
				type?: string;
				z?: boolean;
			}[]
		];
		ra?: boolean;
		rcode?: string;
		rd?: boolean;
		rrname?: string;
		rrtype?: string;
		/**
		 * DNS truncation flag
		 */
		tc?: boolean;
		tx_id?: number;
		type?: string;
		/**
		 * The version of this EVE DNS event
		 */
		version: number;
		z?: boolean;
};

export interface AnomalyEvent {
		app_proto?: string;
		code?: number;
		event?: string;
		layer?: string;
		type?: string;
};

export interface WebsocketEvent {
		fin?: boolean;
		mask?: number;
		opcode?: string;
		payload_base64?: string;
		payload_printable?: string;
};

export interface FlowEvent {
		action?: string;
		age?: number;
		alerted?: boolean;
		bypass?: string;
		bypassed?: {
			bytes_toclient?: number;
			bytes_toserver?: number;
			pkts_toclient?: number;
			pkts_toserver?: number;
		};
		bytes_toclient?: number;
		bytes_toserver?: number;
		dest_ip?: string;
		dest_port?: number;
		elephant?: boolean;
		/**
		 * Direction(s) in which flow was found to be elephant
		 */
		elephant_direction?: unknown[];
		emergency?: boolean;
		end?: string;
		/**
		 * The exception policy(ies) triggered by the flow. Not logged if none was triggered
		 */
		exception_policy?: unknown[];
		pkts_toclient?: number;
		pkts_toserver?: number;
		reason?: string;
		src_ip?: string;
		src_port?: number;
		start?: string;
		state?: string;
		tx_cnt?: number;
		wrong_thread?: boolean;
};

export interface EVESchema {
	alert?: {
		action?: string;
		category?: string;
		/**
		 * Extra context data created by keywords such as dataset with JSON
		 */
		context?: {
			[k: string]: unknown;
		};
		/**
		 * Engine that generated the alert in firewall mode: fw for firewall rules, td for threat detect rules.
		 */
		engine?: 'fw' | 'td';
		gid?: number;
		metadata?: {
			affected_product?: [string, ...string[]];
			attack_target?: [string, ...string[]];
			created_at?: [string, ...string[]];
			deployment?: [string, ...string[]];
			former_category?: [string, ...string[]];
			malware_family?: [string, ...string[]];
			policy?: [string, ...string[]];
			signature_severity?: [string, ...string[]];
			tag?: [string, ...string[]];
			updated_at?: [string, ...string[]];
			[k: string]: unknown;
		};
		references?: [string, ...string[]];
		rev?: number;
		rule?: string;
		severity?: number;
		signature?: string;
		signature_id?: number;
		source?: {
			ip?: string;
			port?: number;
		};
		target?: {
			ip?: string;
			port?: number;
		};
		xff?: string;
	};
	anomaly?: AnomalyEvent;
	/**
	 * Application layer protocol of the flow
	 */
	app_proto?: string;
	/**
	 * In case of a protocol change to a specific protocol, and this specific protocol was not recognised, this field will have the value of the expected protocol
	 */
	app_proto_expected?: string;
	/**
	 * Original application layer protocol of the flow after a protocol change
	 */
	app_proto_orig?: string;
	/**
	 * Application layer protocol detected to client in case of mismatch
	 */
	app_proto_tc?: string;
	/**
	 * Application layer protocol detected to server in case of mismatch
	 */
	app_proto_ts?: string;
	arp?: ARPEvent;
	bittorrent_dht?: BitTorrentDHTEvent;
	capture_file?: string;
	community_id?: string;
	dcerpc?: DCERPCEvent;
	dest_ip?: string;
	dest_port?: number;
	dhcp?: DHCPEvent;
	direction?: string;
	dnp3?: DNP3Event;
	dns?: DNSEvent;
	drop?: {
		ack?: boolean;
		fin?: boolean;
		flowlbl?: number;
		hoplimit?: number;
		icmp_id?: number;
		icmp_seq?: number;
		ipid?: number;
		len?: number;
		psh?: boolean;
		reason?: string;
		rst?: boolean;
		syn?: boolean;
		tc?: number;
		tcpack?: number;
		tcpres?: number;
		tcpseq?: number;
		tcpurgp?: number;
		tcpwin?: number;
		tos?: number;
		ttl?: number;
		udplen?: number;
		urg?: boolean;
		verdict?: VerdictType;
	};
	email?: {
		attachment?: [string, ...string[]];
		body_md5?: string;
		cc?: [string, ...string[]];
		date?: string;
		from?: string;
		message_id?: string;
		received?: [string, ...string[]];
		status?: string;
		subject?: string;
		subject_md5?: string;
		to?: [string, ...string[]];
		url?: [string, ...string[]];
		x_mailer?: string;
	};
	engine?: {
		error?: string;
		error_code?: number;
		message?: string;
		module?: string;
		thread_name?: string;
	};
	enip?: {
		request?: {
			cip?: {
				class_name?: string;
				multiple?: [
					{
						class_name?: string;
						path?: [
							{
								segment_type?: string;
								value?: number;
							},
							...{
								segment_type?: string;
								value?: number;
							}[]
						];
						service?: string;
					},
					...{
						class_name?: string;
						path?: [
							{
								segment_type?: string;
								value?: number;
							},
							...{
								segment_type?: string;
								value?: number;
							}[]
						];
						service?: string;
					}[]
				];
				path?: [
					{
						segment_type?: string;
						value?: number;
					},
					...{
						segment_type?: string;
						value?: number;
					}[]
				];
				service?: string;
			};
			command?: string;
			register_session?: {
				options?: number;
				protocol_version?: number;
			};
			status?: string;
		};
		response?: {
			cip?: {
				multiple?: [
					{
						service?: string;
						status?: string;
						status_extended?: string;
						status_extended_meaning?: string;
					},
					...{
						service?: string;
						status?: string;
						status_extended?: string;
						status_extended_meaning?: string;
					}[]
				];
				service?: string;
				status?: string;
				status_extended?: string;
				status_extended_meaning?: string;
			};
			command?: string;
			identity?: {
				device_type?: string;
				product_code?: number;
				product_name?: string;
				protocol_version?: number;
				revision?: string;
				serial?: number;
				state?: number;
				status?: number;
				vendor_id?: string;
			};
			list_services?: {
				capabilities?: number;
				protocol_version?: number;
				service_name?: string;
			};
			register_session?: {
				options?: number;
				protocol_version?: number;
			};
			status?: string;
		};
	};
	ether?: {
		dest_mac?: string;
		dest_macs?: [string, ...string[]];
		/**
		 * Ethernet type value
		 */
		ether_type?: number;
		src_mac?: string;
		src_macs?: [string, ...string[]];
	};
	event_type: string;
	fileinfo?: {
		/**
		 * The offset of the last byte captured
		 */
		end?: number;
		/**
		 * Represents the id of a file that has been stored
		 */
		file_id?: number;
		/**
		 * Name of the file as observed in network traffic
		 */
		filename?: string;
		/**
		 * Indicates if there were gaps in the file
		 */
		gaps?: boolean;
		/**
		 * [optional, requires libmagic] The magic value for the file
		 */
		magic?: string;
		/**
		 * [optional, if state is ``CLOSED``] When closed, md5 sum
		 */
		md5?: string;
		/**
		 * [optional, if state is ``CLOSED]`` When closed, sha1 sum
		 */
		sha1?: string;
		/**
		 *  The sha256 value for the file, if available
		 */
		sha256?: string;
		sid?: [number, ...number[]];
		/**
		 * The observed size fo the file, in bytes
		 */
		size?: number;
		/**
		 * The offset of the first byte captured
		 */
		start?: number;
		/**
		 * The state of the file when the record is written
		 */
		state?: string;
		/**
		 * Indicates whether the file has been stored
		 */
		stored?: boolean;
		/**
		 * Indicates whether the file is in the process of being stored; true when not yet stored
		 */
		storing?: boolean;
		/**
		 * The transaction id in effect
		 */
		tx_id?: number;
	};
	files?: [
		{
			end?: number;
			file_id?: number;
			filename?: string;
			gaps?: boolean;
			magic?: string;
			md5?: string;
			sha1?: string;
			sha256?: string;
			sid?: [number, ...number[]];
			size?: number;
			start?: number;
			state?: string;
			stored?: boolean;
			/**
			 * The file is set to be stored when completed
			 */
			storing?: boolean;
			tx_id?: number;
		},
		...{
			end?: number;
			file_id?: number;
			filename?: string;
			gaps?: boolean;
			magic?: string;
			md5?: string;
			sha1?: string;
			sha256?: string;
			sid?: [number, ...number[]];
			size?: number;
			start?: number;
			state?: string;
			stored?: boolean;
			/**
			 * The file is set to be stored when completed
			 */
			storing?: boolean;
			tx_id?: number;
		}[]
	];
	firewall?: {
		/**
		 * Firewall hook for the match
		 */
		hook?: string;
		/**
		 * Firewall actions for the match (from rule or default policy)
		 */
		policy?: string;
	};
	flow?: FlowEvent;
	flow_id?: number;
	frame?: {
		complete?: boolean;
		direction?: string;
		id?: number;
		length?: number;
		payload?: string;
		payload_printable?: string;
		stream_offset?: number;
		tx_id?: number;
		type?: string;
	};
	ftp?: {
		command?: string;
		command_data?: string;
		command_truncated?: boolean;
		completion_code?: [string, ...string[]];
		dynamic_port?: number;
		mode?: string;
		reply?: [string, ...string[]];
		reply_received?: string;
		reply_truncated?: boolean;
	};
	ftp_data?: {
		command?: string;
		filename?: string;
	};
	/**
	 * the sensor-name, if configured
	 */
	host?: string;
	http?: HTTPEvent;
	icmp_code?: number;
	icmp_type?: number;
	igmp?: {
		type?: number;
		version?: number;
	};
	ike?: {
		_v?: number;
		attributes?: [
			{
				key?:
					| 'alg_auth'
					| 'alg_dh'
					| 'alg_enc'
					| 'alg_hash'
					| 'sa_key_length'
					| 'sa_life_duration'
					| 'sa_life_type';
				raw?: string | number;
				value?: string;
			},
			...{
				key?:
					| 'alg_auth'
					| 'alg_dh'
					| 'alg_enc'
					| 'alg_hash'
					| 'sa_key_length'
					| 'sa_life_duration'
					| 'sa_life_type';
				raw?: string | number;
				value?: string;
			}[]
		];
		exchange_type?: number;
		exchange_type_verbose?: string;
		ikev1?: {
			client?: {
				key_exchange_payload?: string;
				key_exchange_payload_length?: number;
				nonce_payload?: string;
				nonce_payload_length?: number;
				proposals?: [
					{
						key?:
							| 'alg_auth'
							| 'alg_dh'
							| 'alg_enc'
							| 'alg_hash'
							| 'sa_key_length'
							| 'sa_life_duration'
							| 'sa_life_type';
						raw?: string | number;
						value?: string;
					},
					...{
						key?:
							| 'alg_auth'
							| 'alg_dh'
							| 'alg_enc'
							| 'alg_hash'
							| 'sa_key_length'
							| 'sa_life_duration'
							| 'sa_life_type';
						raw?: string | number;
						value?: string;
					}[]
				];
			};
			doi?: number;
			encrypted_payloads?: boolean;
			server?: {
				key_exchange_payload?: string;
				key_exchange_payload_length?: number;
				nonce_payload?: string;
				nonce_payload_length?: number;
			};
			vendor_ids?: [string, ...string[]];
		};
		ikev2?: {
			errors?: number;
			notify?: unknown[];
		};
		init_spi?: string;
		message_id?: number;
		payload?: [string, ...string[]];
		resp_spi?: string;
		role?: string;
		version_major?: number;
		version_minor?: number;
	};
	in_iface?: string;
	/**
	 * IP version of the packet or flow
	 */
	ip_v?: number;
	krb5?: {
		/**
		 * The client PrincipalName
		 */
		cname?: string;
		/**
		 * Encryption used (only in AS-REP and TGS-REP)
		 */
		encryption?: string;
		/**
		 * Error code, if request has failed
		 */
		error_code?: string;
		/**
		 * The request type for which the response had an error_code
		 */
		failed_request?: string;
		/**
		 * The message type: AS-REQ, AS-REP, etc...
		 */
		msg_type?: string;
		/**
		 * The server Realm
		 */
		realm?: string;
		/**
		 * The server PrincipalName
		 */
		sname?: string;
		/**
		 * Encryption used for ticket
		 */
		ticket_encryption?: string;
		/**
		 * Whether the encryption used for ticket is a weak cipher
		 */
		ticket_weak_encryption?: boolean;
		/**
		 * Whether the encryption used in AS-REP or TGS-REP is a weak cipher
		 */
		weak_encryption?: boolean;
	};
	ldap?: {
		request?: {
			abandon_request?: {
				message_id?: number;
			};
			add_request?: {
				attributes?: [
					{
						name?: string;
						values?: [string, ...string[]];
					},
					...{
						name?: string;
						values?: [string, ...string[]];
					}[]
				];
				entry?: string;
			};
			bind_request?: {
				name?: string;
				sasl?: {
					credentials?: string;
					mechanism?: string;
				};
				version?: number;
			};
			compare_request?: {
				attribute_value_assertion?: {
					description?: string;
					value?: string;
				};
				entry?: string;
			};
			del_request?: {
				dn?: string;
			};
			extended_request?: {
				name?: string;
				value?: string;
			};
			message_id?: number;
			mod_dn_request?: {
				delete_old_rdn?: boolean;
				entry?: string;
				new_rdn?: string;
				new_superior?: string;
			};
			modify_request?: {
				changes?: [
					{
						modification?: {
							attribute_type?: string;
							attribute_values?: [string, ...string[]];
						};
						operation?: string;
					},
					...{
						modification?: {
							attribute_type?: string;
							attribute_values?: [string, ...string[]];
						};
						operation?: string;
					}[]
				];
				object?: string;
			};
			operation?: string;
			search_request?: {
				attributes?: [string, ...string[]];
				base_object?: string;
				deref_alias?: number;
				scope?: number;
				size_limit?: number;
				time_limit?: number;
				types_only?: boolean;
			};
		};
		responses?: [
			{
				add_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				bind_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
					server_sasl_creds?: string;
				};
				compare_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				del_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				extended_response?: {
					matched_dn?: string;
					message?: string;
					name?: string;
					result_code?: string;
					value?: string;
				};
				intermediate_response?: {
					name?: string;
					value?: string;
				};
				message_id?: number;
				mod_dn_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				modify_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				operation?: string;
				search_result_done?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				search_result_entry?: {
					attributes?: [
						{
							type?: string;
							values?: [string, ...string[]];
						},
						...{
							type?: string;
							values?: [string, ...string[]];
						}[]
					];
					base_object?: string;
				};
			},
			...{
				add_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				bind_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
					server_sasl_creds?: string;
				};
				compare_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				del_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				extended_response?: {
					matched_dn?: string;
					message?: string;
					name?: string;
					result_code?: string;
					value?: string;
				};
				intermediate_response?: {
					name?: string;
					value?: string;
				};
				message_id?: number;
				mod_dn_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				modify_response?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				operation?: string;
				search_result_done?: {
					matched_dn?: string;
					message?: string;
					result_code?: string;
				};
				search_result_entry?: {
					attributes?: [
						{
							type?: string;
							values?: [string, ...string[]];
						},
						...{
							type?: string;
							values?: [string, ...string[]];
						}[]
					];
					base_object?: string;
				};
			}[]
		];
	};
	/**
	 * LLMNR requests and responses
	 */
	llmnr?: {
		/**
		 * LLMNR additional records
		 */
		additionals?: [
			{
				/**
				 * IPv4 address
				 */
				a?: string;
				/**
				 * IPv6 address
				 */
				aaaa?: string;
				/**
				 * Canonical name
				 */
				cname?: string;
				/**
				 * Mail exchange
				 */
				mx?: string;
				/**
				 * Name server
				 */
				ns?: string;
				/**
				 * NULL record data
				 */
				null?: string;
				/**
				 * EDNS OPT records
				 */
				opt?: [
					{
						/**
						 * EDNS option code
						 */
						code?: number;
						/**
						 * EDNS option data
						 */
						data?: string;
					},
					...{
						/**
						 * EDNS option code
						 */
						code?: number;
						/**
						 * EDNS option data
						 */
						data?: string;
					}[]
				];
				/**
				 * Pointer record
				 */
				ptr?: string;
				/**
				 * Resource name of the record
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Resource record type
				 */
				rrtype?: string;
				/**
				 * Time to live in seconds
				 */
				ttl?: number;
				/**
				 * TXT record values
				 */
				txt?: [string, ...string[]];
				/**
				 * Unknown record type data
				 */
				unknown?: string;
			},
			...{
				/**
				 * IPv4 address
				 */
				a?: string;
				/**
				 * IPv6 address
				 */
				aaaa?: string;
				/**
				 * Canonical name
				 */
				cname?: string;
				/**
				 * Mail exchange
				 */
				mx?: string;
				/**
				 * Name server
				 */
				ns?: string;
				/**
				 * NULL record data
				 */
				null?: string;
				/**
				 * EDNS OPT records
				 */
				opt?: [
					{
						/**
						 * EDNS option code
						 */
						code?: number;
						/**
						 * EDNS option data
						 */
						data?: string;
					},
					...{
						/**
						 * EDNS option code
						 */
						code?: number;
						/**
						 * EDNS option data
						 */
						data?: string;
					}[]
				];
				/**
				 * Pointer record
				 */
				ptr?: string;
				/**
				 * Resource name of the record
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Resource record type
				 */
				rrtype?: string;
				/**
				 * Time to live in seconds
				 */
				ttl?: number;
				/**
				 * TXT record values
				 */
				txt?: [string, ...string[]];
				/**
				 * Unknown record type data
				 */
				unknown?: string;
			}[]
		];
		/**
		 * LLMNR answer records
		 */
		answers?: [
			{
				/**
				 * IPv4 address
				 */
				a?: string;
				/**
				 * IPv6 address
				 */
				aaaa?: string;
				/**
				 * Canonical name
				 */
				cname?: string;
				/**
				 * Mail exchange
				 */
				mx?: string;
				/**
				 * Name server
				 */
				ns?: string;
				/**
				 * NULL record data
				 */
				null?: string;
				/**
				 * Pointer record
				 */
				ptr?: string;
				/**
				 * Resource name of the record
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Resource record type
				 */
				rrtype?: string;
				/**
				 * SOA record data
				 */
				soa?: {
					expire?: number;
					minimum?: number;
					mname?: string;
					/**
					 * Set to true if the mname was too long and truncated by Suricata
					 */
					mname_truncated?: boolean;
					refresh?: number;
					retry?: number;
					rname?: string;
					serial?: number;
				};
				/**
				 * SRV record data
				 */
				srv?: {
					/**
					 * Target hostname
					 */
					name?: string;
					/**
					 * Target port
					 */
					port?: number;
					/**
					 * Priority value
					 */
					priority?: number;
					/**
					 * Weight value
					 */
					weight?: number;
				};
				/**
				 * SSH fingerprint record
				 */
				sshfp?: {
					/**
					 * Algorithm number
					 */
					algo?: number;
					/**
					 * Fingerprint value
					 */
					fingerprint?: string;
					/**
					 * Fingerprint type
					 */
					type?: number;
				};
				/**
				 * Time to live in seconds
				 */
				ttl?: number;
				/**
				 * TXT record values
				 */
				txt?: [string, ...string[]];
				/**
				 * Unknown record type data
				 */
				unknown?: string;
			},
			...{
				/**
				 * IPv4 address
				 */
				a?: string;
				/**
				 * IPv6 address
				 */
				aaaa?: string;
				/**
				 * Canonical name
				 */
				cname?: string;
				/**
				 * Mail exchange
				 */
				mx?: string;
				/**
				 * Name server
				 */
				ns?: string;
				/**
				 * NULL record data
				 */
				null?: string;
				/**
				 * Pointer record
				 */
				ptr?: string;
				/**
				 * Resource name of the record
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Resource record type
				 */
				rrtype?: string;
				/**
				 * SOA record data
				 */
				soa?: {
					expire?: number;
					minimum?: number;
					mname?: string;
					/**
					 * Set to true if the mname was too long and truncated by Suricata
					 */
					mname_truncated?: boolean;
					refresh?: number;
					retry?: number;
					rname?: string;
					serial?: number;
				};
				/**
				 * SRV record data
				 */
				srv?: {
					/**
					 * Target hostname
					 */
					name?: string;
					/**
					 * Target port
					 */
					port?: number;
					/**
					 * Priority value
					 */
					priority?: number;
					/**
					 * Weight value
					 */
					weight?: number;
				};
				/**
				 * SSH fingerprint record
				 */
				sshfp?: {
					/**
					 * Algorithm number
					 */
					algo?: number;
					/**
					 * Fingerprint value
					 */
					fingerprint?: string;
					/**
					 * Fingerprint type
					 */
					type?: number;
				};
				/**
				 * Time to live in seconds
				 */
				ttl?: number;
				/**
				 * TXT record values
				 */
				txt?: [string, ...string[]];
				/**
				 * Unknown record type data
				 */
				unknown?: string;
			}[]
		];
		/**
		 * LLMNR authority records
		 */
		authorities?: [
			{
				/**
				 * IPv4 address
				 */
				a?: string;
				/**
				 * IPv6 address
				 */
				aaaa?: string;
				/**
				 * Canonical name
				 */
				cname?: string;
				/**
				 * Mail exchange
				 */
				mx?: string;
				/**
				 * Name server
				 */
				ns?: string;
				/**
				 * NULL record data
				 */
				null?: string;
				/**
				 * Pointer record
				 */
				ptr?: string;
				/**
				 * Resource name of the record
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Resource record type
				 */
				rrtype?: string;
				/**
				 * SOA record data
				 */
				soa?: {
					expire?: number;
					minimum?: number;
					mname?: string;
					/**
					 * Set to true if the mname was too long and truncated by Suricata
					 */
					mname_truncated?: boolean;
					refresh?: number;
					retry?: number;
					rname?: string;
					serial?: number;
				};
				/**
				 * Time to live in seconds
				 */
				ttl?: number;
				/**
				 * TXT record values
				 */
				txt?: [string, ...string[]];
				/**
				 * Unknown record type data
				 */
				unknown?: string;
			},
			...{
				/**
				 * IPv4 address
				 */
				a?: string;
				/**
				 * IPv6 address
				 */
				aaaa?: string;
				/**
				 * Canonical name
				 */
				cname?: string;
				/**
				 * Mail exchange
				 */
				mx?: string;
				/**
				 * Name server
				 */
				ns?: string;
				/**
				 * NULL record data
				 */
				null?: string;
				/**
				 * Pointer record
				 */
				ptr?: string;
				/**
				 * Resource name of the record
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Resource record type
				 */
				rrtype?: string;
				/**
				 * SOA record data
				 */
				soa?: {
					expire?: number;
					minimum?: number;
					mname?: string;
					/**
					 * Set to true if the mname was too long and truncated by Suricata
					 */
					mname_truncated?: boolean;
					refresh?: number;
					retry?: number;
					rname?: string;
					serial?: number;
				};
				/**
				 * Time to live in seconds
				 */
				ttl?: number;
				/**
				 * TXT record values
				 */
				txt?: [string, ...string[]];
				/**
				 * Unknown record type data
				 */
				unknown?: string;
			}[]
		];
		/**
		 * LLMNR message flags
		 */
		flags?: ('c' | 'tc' | 't')[];
		/**
		 * Grouped answer records by type
		 */
		grouped?: {
			/**
			 * IPv4 address records
			 */
			A?: [string, ...string[]];
			/**
			 * IPv6 address records
			 */
			AAAA?: [string, ...string[]];
			/**
			 * Canonical name records
			 */
			CNAME?: [string, ...string[]];
			/**
			 * Mail exchange records
			 */
			MX?: [string, ...string[]];
			/**
			 * Name server records
			 */
			NS?: [string, ...string[]];
			/**
			 * NULL record data
			 */
			NULL?: [string, ...string[]];
			/**
			 * Pointer records
			 */
			PTR?: [string, ...string[]];
			/**
			 * Start of authority records
			 */
			SOA?: [DnsSoa, ...DnsSoa[]];
			/**
			 * Text records
			 */
			TXT?: [string, ...string[]];
		};
		/**
		 * LLMNR transaction ID
		 */
		id?: number;
		/**
		 * LLMNR opcode value
		 */
		opcode?: number;
		/**
		 * LLMNR query records
		 */
		queries?: [
			{
				/**
				 * Resource name being requested
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Type of resource being requested
				 */
				rrtype?: string;
			},
			...{
				/**
				 * Resource name being requested
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Type of resource being requested
				 */
				rrtype?: string;
			}[]
		];
		/**
		 * Internal transaction ID
		 */
		tx_id?: number;
		/**
		 * Type of message, either a request or response
		 */
		type?: 'request' | 'response';
	};
	log_level?: string;
	/**
	 * mDNS requests and responses
	 */
	mdns?: {
		/**
		 * mDNS additional records
		 */
		additionals?: [
			{
				/**
				 * Value of the requested PTR record
				 */
				ptr?: string;
				/**
				 * Resource name of the record being returned
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Value of the requested TXT record
				 */
				txt?: [string, ...string[]];
			},
			...{
				/**
				 * Value of the requested PTR record
				 */
				ptr?: string;
				/**
				 * Resource name of the record being returned
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Value of the requested TXT record
				 */
				txt?: [string, ...string[]];
			}[]
		];
		/**
		 * mDNS answer records
		 */
		answers?: [
			{
				/**
				 * Value of the requested PTR record
				 */
				ptr?: string;
				/**
				 * Resource name of the record being returned
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Value of the requested TXT record
				 */
				txt?: [string, ...string[]];
			},
			...{
				/**
				 * Value of the requested PTR record
				 */
				ptr?: string;
				/**
				 * Resource name of the record being returned
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Value of the requested TXT record
				 */
				txt?: [string, ...string[]];
			}[]
		];
		/**
		 * mDNS authority records
		 */
		authorities?: [
			{
				/**
				 * Resource name of the record being returned
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
			},
			...{
				/**
				 * Resource name of the record being returned
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
			}[]
		];
		/**
		 * mDNS message flags
		 */
		flags?: (
			| AuthoritativeAnswer
			| Truncated
			| RecursionDesired
			| RecursionAvailable
			| ZReserved
			| AuthenticData
			| CheckingDisabled
		)[];
		/**
		 * mDNS transaction ID
		 */
		id?: number;
		/**
		 * mDNS opcode value
		 */
		opcode?: number;
		/**
		 * mDNS query records
		 */
		queries?: [
			{
				/**
				 * Resource name being requested
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Type of resource being requested
				 */
				rrtype?: string;
			},
			...{
				/**
				 * Resource name being requested
				 */
				rrname?: string;
				/**
				 * Name was truncated by Suricata due to length
				 */
				rrname_truncated?: boolean;
				/**
				 * Type of resource being requested
				 */
				rrtype?: string;
			}[]
		];
		/**
		 * mDNS reply (error) code
		 */
		rcode?: number;
		/**
		 * Type of message, either a request or response
		 */
		type?: 'request' | 'response';
	};
	metadata?: {
		entropy?: {
			[k: string]: unknown;
		};
		flowbits?: [string, ...string[]];
		flowints?: {
			[k: string]: unknown;
		};
		flowvars?: [
			{
				gid?: string;
				key?: string;
				value?: string;
				[k: string]: unknown;
			},
			...{
				gid?: string;
				key?: string;
				value?: string;
				[k: string]: unknown;
			}[]
		];
		pktvars?: [
			{
				uid?: string;
				username?: string;
				[k: string]: unknown;
			},
			...{
				uid?: string;
				username?: string;
				[k: string]: unknown;
			}[]
		];
	};
	modbus?: {
		id?: number;
		request?: {
			access_type?: string;
			category?: string;
			data?: string;
			diagnostic?: {
				code?: string;
				data?: string;
				raw?: number;
			};
			error_flags?: string;
			function_code?: string;
			function_raw?: number;
			mei?: {
				code?: string;
				data?: string;
				raw?: number;
			};
			protocol_id?: number;
			read?: {
				address?: number;
				quantity?: number;
			};
			transaction_id?: number;
			unit_id?: number;
			write?: {
				address?: number;
				data?: number;
			};
		};
		response?: {
			access_type?: string;
			category?: string;
			data?: string;
			diagnostic?: {
				code?: string;
				data?: string;
				raw?: number;
			};
			error_flags?: string;
			exception?: {
				code?: string;
				raw?: number;
			};
			function_code?: string;
			function_raw?: number;
			protocol_id?: number;
			read?: {
				data?: string;
			};
			transaction_id?: number;
			unit_id?: number;
			write?: {
				address?: number;
				data?: number;
			};
		};
	};
	mqtt?: {
		connack?: {
			dup?: boolean;
			properties?: {
				[k: string]: unknown;
			};
			qos?: number;
			retain?: boolean;
			return_code?: number;
			session_present?: boolean;
		};
		connect?: {
			client_id?: string;
			dup?: boolean;
			flags?: {
				clean_session?: boolean;
				password?: boolean;
				username?: boolean;
				will?: boolean;
				will_retain?: boolean;
			};
			password?: string;
			properties?: {
				[k: string]: unknown;
			};
			protocol_string?: string;
			protocol_version?: number;
			qos?: number;
			retain?: boolean;
			username?: string;
			will?: {
				message?: string;
				properties?: {
					[k: string]: unknown;
				};
				topic?: string;
			};
		};
		disconnect?: {
			dup?: boolean;
			properties?: {
				[k: string]: unknown;
			};
			qos?: number;
			reason_code?: number;
			retain?: boolean;
		};
		pingreq?: {
			dup?: boolean;
			qos?: number;
			retain?: boolean;
		};
		pingresp?: {
			dup?: boolean;
			qos?: number;
			retain?: boolean;
		};
		puback?: {
			dup?: boolean;
			message_id?: number;
			qos?: number;
			reason_code?: number;
			retain?: boolean;
		};
		pubcomp?: {
			dup?: boolean;
			message_id?: number;
			qos?: number;
			reason_code?: number;
			retain?: boolean;
		};
		publish?: {
			dup?: boolean;
			message?: string;
			message_id?: number;
			properties?: {
				[k: string]: unknown;
			};
			qos?: number;
			retain?: boolean;
			skipped_length?: number;
			topic?: string;
			truncated?: boolean;
		};
		pubrec?: {
			dup?: boolean;
			message_id?: number;
			qos?: number;
			reason_code?: number;
			retain?: boolean;
		};
		pubrel?: {
			dup?: boolean;
			message_id?: number;
			qos?: number;
			reason_code?: number;
			retain?: boolean;
		};
		suback?: {
			dup?: boolean;
			message_id?: number;
			qos?: number;
			qos_granted?: [number, ...number[]];
			retain?: boolean;
		};
		subscribe?: {
			dup?: boolean;
			message_id?: number;
			qos?: number;
			retain?: boolean;
			topics?: [
				{
					qos?: number;
					topic?: string;
				},
				...{
					qos?: number;
					topic?: string;
				}[]
			];
		};
		unsuback?: {
			dup?: boolean;
			message_id?: number;
			qos?: number;
			reason_codes?: [number, ...number[]];
			retain?: boolean;
		};
		unsubscribe?: {
			dup?: boolean;
			message_id?: number;
			qos?: number;
			retain?: boolean;
			topics?: [string, ...string[]];
		};
	};
	/**
	 * nDPI plugin, contents provided by 3rd party library
	 */
	ndpi?: {
		[k: string]: unknown;
	};
	netflow?: {
		/**
		 * Duration of the flow (measured from timestamp of last packet and first packet)
		 */
		age?: number;
		/**
		 * Total number of bytes transferred to server/client
		 */
		bytes?: number;
		/**
		 * Date of the end of the flow
		 */
		end?: string;
		/**
		 * Maximum observed Time-To-Live (TTL) value
		 */
		max_ttl?: number;
		/**
		 * Minimum observed TTL value
		 */
		min_ttl?: number;
		/**
		 * Total number of packets transferred to server,client
		 */
		pkts?: number;
		/**
		 * Date of start of the flow
		 */
		start?: string;
		/**
		 * Number of transactions seen in the flow (only present if flow has an application layer)
		 */
		tx_cnt?: number;
	};
	nfs?: {
		file_tx?: boolean;
		filename?: string;
		hhash?: string;
		id?: number;
		procedure?: string;
		read?: {
			chunks?: number;
			first?: boolean;
			last?: boolean;
			last_xid?: number;
		};
		rename?: {
			from?: string;
			to?: string;
		};
		status?: string;
		type?: string;
		version?: number;
		write?: {
			chunks?: number;
			first?: boolean;
			last?: boolean;
			last_xid?: number;
		};
	};
	ntp?: {
		/**
		 * The mode of the NTP message
		 */
		mode?: number;
		/**
		 * Identifies specific server or reference clock as a colon-separated 4-byte hex string
		 */
		reference_id?: string;
		/**
		 * Indicates distance from the reference clock
		 */
		stratum?: number;
		/**
		 * The NTP version number, typically 3 or 4
		 */
		version?: number;
	};
	packet?: string;
	packet_info?: {
		linktype?: number;
		/**
		 * The descriptive name of the linktype
		 */
		linktype_name?: string;
	};
	parent_id?: number;
	payload?: string;
	payload_length?: number;
	payload_printable?: string;
	pcap_cnt?: number;
	pcap_filename?: string;
	pgsql?: {
		request?: {
			/**
			 * CopyData message from CopyIn mode
			 */
			copy_data_in?: {
				/**
				 * Accumulated data size of all CopyData messages sent
				 */
				data_size?: number;
				/**
				 * How many CopyData messages were sent (does not necessarily match number of rows from the query)
				 */
				msg_count?: number;
			};
			message?: string;
			password?: string;
			/**
			 * Indicates if a password message was received but not logged due to Suricata settings
			 */
			password_redacted?: boolean;
			process_id?: number;
			protocol_version?: string;
			sasl_authentication_mechanism?: string;
			sasl_param?: string;
			sasl_response?: string;
			secret_key?: number;
			simple_query?: string;
			startup_parameters?: {
				optional_parameters?: [
					{
						application_name?: string;
						client_encoding?: string;
						database?: string;
						datestyle?: string;
						extra_float_digits?: string;
						options?: string;
						replication?: string;
						[k: string]: unknown;
					},
					...{
						application_name?: string;
						client_encoding?: string;
						database?: string;
						datestyle?: string;
						extra_float_digits?: string;
						options?: string;
						replication?: string;
						[k: string]: unknown;
					}[]
				];
				user?: string;
			};
		};
		response?: {
			authentication_md5_password?: string;
			authentication_sasl_final?: string;
			code?: string;
			command_completed?: string;
			/**
			 * CopyData message from CopyOut mode
			 */
			copy_data_out?: {
				/**
				 * Accumulated data size of all CopyData messages sent
				 */
				data_size?: number;
				/**
				 * Number of rows sent in CopyData messages
				 */
				row_count?: number;
			};
			/**
			 * Backend/server response accepting CopyIn mode
			 */
			copy_in_response?: {
				/**
				 * Number of columns that will be copied in the CopyData message
				 */
				columns?: number;
			};
			/**
			 * Backend/server response accepting CopyOut mode
			 */
			copy_out_response?: {
				/**
				 * Number of columns that will be copied in the CopyData message
				 */
				columns?: number;
			};
			data_rows?: number;
			data_size?: number;
			field_count?: number;
			file?: string;
			line?: string;
			message?: string;
			parameter_status?: [
				{
					application_name?: string;
					client_encoding?: string;
					date_style?: string;
					integer_datetimes?: string;
					interval_style?: string;
					is_superuser?: string;
					server_encoding?: string;
					server_version?: string;
					session_authorization?: string;
					standard_conforming_strings?: string;
					time_zone?: string;
					[k: string]: unknown;
				},
				...{
					application_name?: string;
					client_encoding?: string;
					date_style?: string;
					integer_datetimes?: string;
					interval_style?: string;
					is_superuser?: string;
					server_encoding?: string;
					server_version?: string;
					session_authorization?: string;
					standard_conforming_strings?: string;
					time_zone?: string;
					[k: string]: unknown;
				}[]
			];
			process_id?: number;
			routine?: string;
			secret_key?: number;
			severity_localizable?: string;
			severity_non_localizable?: string;
			ssl_accepted?: boolean;
		};
		tx_id?: number;
	};
	pkt_src?: string;
	pop3?: {
		request?: {
			/**
			 * Pop3 request arguments
			 */
			args?: string[];
			/**
			 * A pop3 command, for example `USER` or `STAT`
			 */
			command?: string;
		};
		response?: {
			data?: string[];
			/**
			 * First line of response
			 */
			header?: string;
			status?: string;
			/**
			 * Response indicated positive status ie +OK
			 */
			success?: boolean;
		};
	};
	proto?: string;
	quic?: {
		/**
		 * JA3-like fingerprint for versions of QUIC before standardization
		 */
		cyu?: [
			{
				/**
				 * CYU hash hex representation
				 */
				hash?: string;
				/**
				 * CYU hash string representation
				 */
				string?: string;
			},
			...{
				/**
				 * CYU hash hex representation
				 */
				hash?: string;
				/**
				 * CYU hash string representation
				 */
				string?: string;
			}[]
		];
		/**
		 * list of extensions in hello
		 */
		extensions?: [
			{
				/**
				 * Human-friendly name of the extension
				 */
				name?: string;
				/**
				 * Integer identifier of the extension
				 */
				type?: number;
				/**
				 * Extension values
				 */
				values?: [string, ...string[]];
			},
			...{
				/**
				 * Human-friendly name of the extension
				 */
				name?: string;
				/**
				 * Integer identifier of the extension
				 */
				type?: number;
				/**
				 * Extension values
				 */
				values?: [string, ...string[]];
			}[]
		];
		/**
		 * JA3 from client, as in TLS
		 */
		ja3?: {
			/**
			 * JA3 hex representation
			 */
			hash?: string;
			/**
			 * JA3 string representation
			 */
			string?: string;
		};
		/**
		 * JA3 from server, as in TLS
		 */
		ja3s?: {
			/**
			 * JA3s hex representation
			 */
			hash?: string;
			/**
			 * JA3s string representation
			 */
			string?: string;
		};
		ja4?: string;
		/**
		 * Server Name Indication
		 */
		sni?: string;
		/**
		 * User Agent for versions of QUIC before standardization
		 */
		ua?: string;
		/**
		 * Quic protocol version
		 */
		version?: string;
	};
	rdp?: {
		channels?: [string, ...string[]];
		client?: {
			build?: string;
			capabilities?: [string, ...string[]];
			client_name?: string;
			color_depth?: number;
			desktop_height?: number;
			desktop_width?: number;
			function_keys?: number;
			id?: string;
			keyboard_layout?: string;
			keyboard_type?: string;
			product_id?: number;
			version?: string;
		};
		cookie?: string;
		event_type?: string;
		tx_id?: number;
	};
	response_icmp_code?: number;
	response_icmp_type?: number;
	rfb?: {
		authentication?: {
			security_result?: string;
			security_type?: number;
			vnc?: {
				challenge?: string;
				response?: string;
			};
		};
		client_protocol_version?: {
			major?: string;
			minor?: string;
		};
		framebuffer?: {
			height?: number;
			name?: string;
			pixel_format?: {
				big_endian?: boolean;
				bits_per_pixel?: number;
				blue_max?: number;
				blue_shift?: number;
				depth?: number;
				green_max?: number;
				green_shift?: number;
				red_max?: number;
				red_shift?: number;
				true_color?: boolean;
			};
			width?: number;
		};
		screen_shared?: boolean;
		server_protocol_version?: {
			major?: string;
			minor?: string;
		};
	};
	rgmp?: {
		type?: number;
	};
	rpc?: {
		auth_type?: string;
		creds?: {
			gid?: number;
			machine_name?: string;
			uid?: number;
		};
		status?: string;
		xid?: number;
	};
	/**
	 * SCTP protocol information
	 */
	sctp?: {
		/**
		 * Number of SCTP chunks in the packet
		 */
		chunk_cnt?: number;
		/**
		 * Array of SCTP chunk type names present in the packet
		 */
		chunk_types?: string[];
		/**
		 * Whether the packet contains an ABORT chunk
		 */
		has_abort?: boolean;
		/**
		 * Whether the packet contains a DATA chunk
		 */
		has_data?: boolean;
		/**
		 * Whether the packet contains an INIT chunk
		 */
		has_init?: boolean;
		/**
		 * Whether the packet contains an INIT_ACK chunk
		 */
		has_init_ack?: boolean;
		/**
		 * SCTP verification tag
		 */
		vtag?: number;
	};
	sip?: {
		code?: string;
		method?: string;
		reason?: string;
		request_line?: string;
		response_line?: string;
		/**
		 * SDP message body
		 */
		sdp?: {
			/**
			 * A list of attributes to extend SDP
			 */
			attributes?: [string, ...string[]];
			/**
			 * Proposed bandwidths to be used by the session or media
			 */
			bandwidths?: [string, ...string[]];
			/**
			 * Connection data
			 */
			connection_data?: string;
			/**
			 * Email address for the person responsible for the conference
			 */
			email?: string;
			/**
			 * Field used to convey encryption keys if SDP is used over a secure channel
			 */
			encryption_key?: string;
			/**
			 * A list of media descriptions for a session
			 */
			media_descriptions?: [
				{
					/**
					 * A list of attributes specified for a media description
					 */
					attributes?: [string, ...string[]];
					/**
					 * A list of bandwidth proposed for a media
					 */
					bandwidths?: [string, ...string[]];
					/**
					 * Connection data per media description
					 */
					connection_data?: string;
					/**
					 * Field used to convey encryption keys if SDP is used over a secure channel
					 */
					encryption_key?: string;
					/**
					 * Media description
					 */
					media?: string;
					/**
					 * Media information primarily intended for labelling media streams
					 */
					media_info?: string;
				},
				...{
					/**
					 * A list of attributes specified for a media description
					 */
					attributes?: [string, ...string[]];
					/**
					 * A list of bandwidth proposed for a media
					 */
					bandwidths?: [string, ...string[]];
					/**
					 * Connection data per media description
					 */
					connection_data?: string;
					/**
					 * Field used to convey encryption keys if SDP is used over a secure channel
					 */
					encryption_key?: string;
					/**
					 * Media description
					 */
					media?: string;
					/**
					 * Media information primarily intended for labelling media streams
					 */
					media_info?: string;
				}[]
			];
			/**
			 * Owner of the session
			 */
			origin?: string;
			/**
			 * Phone number for the person responsible for the conference
			 */
			phone_number?: string;
			/**
			 * Textual information about the session
			 */
			session_info?: string;
			/**
			 * Session name
			 */
			session_name?: string;
			/**
			 * A list of time descriptions for a session
			 */
			time_descriptions?: [
				{
					/**
					 * Specify repeat times for a session
					 */
					repeat_time?: string;
					/**
					 * Start and stop times for a session
					 */
					time?: string;
				},
				...{
					/**
					 * Specify repeat times for a session
					 */
					repeat_time?: string;
					/**
					 * Start and stop times for a session
					 */
					time?: string;
				}[]
			];
			/**
			 * Timezone to specify adjustments for times and offsets from the base time
			 */
			timezone?: string;
			/**
			 * A pointer to additional information about the session
			 */
			uri?: string;
			/**
			 * SDP protocol version
			 */
			version?: number;
		};
		uri?: string;
		version?: string;
	};
	smb?: {
		access?: string;
		accessed?: number;
		changed?: number;
		client_dialects?: [string, ...string[]];
		client_guid?: string;
		command?: string;
		created?: number;
		dcerpc?: {
			call_id?: number;
			interfaces?: [
				{
					ack_reason?: number;
					ack_result?: number;
					uuid?: string;
					version?: string;
				},
				...{
					ack_reason?: number;
					ack_result?: number;
					uuid?: string;
					version?: string;
				}[]
			];
			opnum?: number;
			req?: {
				frag_cnt?: number;
				stub_data_size?: number;
			};
			request?: string;
			res?: {
				frag_cnt?: number;
				stub_data_size?: number;
			};
			response?: string;
		};
		dialect?: string;
		directory?: string;
		disposition?: string;
		filename?: string;
		fuid?: string;
		function?: string;
		id?: number;
		kerberos?: {
			realm?: string;
			snames?: [string, ...string[]];
		};
		level_of_interest?: string;
		max_read_size?: number;
		max_write_size?: number;
		modified?: number;
		named_pipe?: string;
		ntlmssp?: {
			domain?: string;
			host?: string;
			user?: string;
			version?: string;
			warning?: boolean;
		};
		rename?: {
			from?: string;
			to?: string;
		};
		request?: {
			native_lm?: string;
			native_os?: string;
		};
		request_done?: boolean;
		response?: {
			native_lm?: string;
			native_os?: string;
		};
		response_done?: boolean;
		server_guid?: string;
		service?: {
			request?: string;
			response?: string;
		};
		session_id?: number;
		set_info?: {
			class?: string;
			info_level?: string;
		};
		share?: string;
		share_type?: string;
		size?: number;
		status?: string;
		status_code?: string;
		subcmd?: string;
		tree_id?: number;
	};
	smtp?: {
		helo?: string;
		mail_from?: string;
		rcpt_to?: [string, ...string[]];
	};
	snmp?: {
		community?: string;
		pdu_type?: string;
		trap_address?: string;
		trap_oid?: string;
		trap_type?: string;
		usm?: string;
		vars?: [string, ...string[]];
		version?: number;
	};
	spi?: number;
	src_ip?: string;
	src_port?: number;
	ssh?: {
		client?: {
			hassh?: {
				hash?: string;
				string?: string;
			};
			proto_version?: string;
			software_version?: string;
		};
		server?: {
			hassh?: {
				hash?: string;
				string?: string;
			};
			proto_version?: string;
			software_version?: string;
		};
	};
	stats?: {
		/**
		 * Module with observational and performance-related statistics from application layer protocol parsers and flows
		 */
		app_layer?: {
			error?: {
				/**
				 * Errors encountered parsing BitTorrent DHT protocol
				 */
				bittorrent_dht?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing DCERPC/TCP protocol
				 */
				dcerpc_tcp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing DCERPC/UDP protocol
				 */
				dcerpc_udp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing DHCP
				 */
				dhcp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing DNP3
				 */
				dnp3?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing DNS/TCP protocol
				 */
				dns_tcp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing DNS/UDP protocol
				 */
				dns_udp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				doh2?: StatsApplayerError;
				/**
				 * Errors encounterd parsing ENIP/TCP
				 */
				enip_tcp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing ENIP/UDP
				 */
				enip_udp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing TCP
				 */
				failed_tcp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing FTP
				 */
				ftp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing FTP data
				 */
				ftp_data?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing HTTP
				 */
				http?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing HTTP/2
				 */
				http2?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing IKE protocol
				 */
				ike?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing IMAP
				 */
				imap?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing Kerberos v5/TCP protocol
				 */
				krb5_tcp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing Kerberos v5/UDP protocol
				 */
				krb5_udp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing LDAP/TCP protocol
				 */
				ldap_tcp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing LDAP/UDP protocol
				 */
				ldap_udp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing LLMNR/TCP protocol
				 */
				llmnr_tcp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing LLMNR/UDP protocol
				 */
				llmnr_udp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing mDNS
				 */
				mdns?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing Modbus protocol
				 */
				modbus?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing MQTT protocol
				 */
				mqtt?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing NFS/TCP protocol
				 */
				nfs_tcp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing NFS/UDP protocol
				 */
				nfs_udp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing NTP
				 */
				ntp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing PostgreSQL protocol
				 */
				pgsql?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				pop3?: StatsApplayerError;
				/**
				 * Errors encountered parsing QUIC protocol
				 */
				quic?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing RDP
				 */
				rdp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing RFB protocol
				 */
				rfb?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing SIP/TCP protocol
				 */
				sip_tcp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing SIP/UDP protocol
				 */
				sip_udp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing SMB protocol
				 */
				smb?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing SMTP
				 */
				smtp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing SNMP
				 */
				snmp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing SSH protocol
				 */
				ssh?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing Telnet protocol
				 */
				telnet?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing TFTP
				 */
				tftp?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				/**
				 * Errors encountered parsing TLS protocol
				 */
				tls?: {
					/**
					 * Number of errors allocating memory
					 */
					alloc?: number;
					/**
					 * How many times app-layer error exception policy was applied, and which one
					 */
					exception_policy?: {
						bypass?: number;
						drop_flow?: number;
						drop_packet?: number;
						pass_flow?: number;
						pass_packet?: number;
						reject?: number;
						reject_both?: number;
					};
					/**
					 * Number of errors processing gaps
					 */
					gap?: number;
					/**
					 * Number of internal parser errors
					 */
					internal?: number;
					/**
					 * Number of errors reported by parser
					 */
					parser?: number;
				};
				websocket?: StatsApplayerError;
			};
			/**
			 * Expectation (dynamic parallel flow) counter
			 */
			expectations?: number;
			flow?: {
				/**
				 * Number of flows for BitTorrent DHT protocol
				 */
				bittorrent_dht?: number;
				/**
				 * Number of flows for DCERPC/TCP protocol
				 */
				dcerpc_tcp?: number;
				/**
				 * Number of flows for DCERPC/UDP protocol
				 */
				dcerpc_udp?: number;
				/**
				 * Number of flows for DHCP
				 */
				dhcp?: number;
				/**
				 * Number of flows for DNP3
				 */
				dnp3?: number;
				/**
				 * Number of flows for DNS/TCP protocol
				 */
				dns_tcp?: number;
				/**
				 * Number of flows for DNS/UDP protocol
				 */
				dns_udp?: number;
				doh2?: number;
				/**
				 * Number of flows for ENIP/TCP
				 */
				enip_tcp?: number;
				/**
				 * Number of flows for ENIP/UDP
				 */
				enip_udp?: number;
				/**
				 * Number of failed flows for TCP
				 */
				failed_tcp?: number;
				/**
				 * Number of failed flows for UDP
				 */
				failed_udp?: number;
				/**
				 * Number of flows for FTP
				 */
				ftp?: number;
				/**
				 * Number of flows for FTP data protocol
				 */
				ftp_data?: number;
				/**
				 * Number of flows for HTTP
				 */
				http?: number;
				/**
				 * Number of flows for HTTP/2
				 */
				http2?: number;
				/**
				 * Number of flows for IKE protocol
				 */
				ike?: number;
				/**
				 * Number of flows for IKE v2 protocol
				 */
				ikev2?: number;
				/**
				 * Number of flows for IMAP
				 */
				imap?: number;
				/**
				 * Number of flows for Kerberos v5/TCP protocol
				 */
				krb5_tcp?: number;
				/**
				 * Number of flows for Kerberos v5/UDP protocol
				 */
				krb5_udp?: number;
				/**
				 * Number of flows for LDAP/TCP protocol
				 */
				ldap_tcp?: number;
				/**
				 * Number of flows LDAP/UDP protocol
				 */
				ldap_udp?: number;
				/**
				 * Number of flows for LLMNR/TCP protocol
				 */
				llmnr_tcp?: number;
				/**
				 * Number of flows for LLMNR/UDP protocol
				 */
				llmnr_udp?: number;
				/**
				 * Number of flows for mDNS
				 */
				mdns?: number;
				/**
				 * Number of flows for Modbus protocol
				 */
				modbus?: number;
				/**
				 * Number of flows for MQTT protocol
				 */
				mqtt?: number;
				/**
				 * Number of flows for NFS/TCP protocol
				 */
				nfs_tcp?: number;
				/**
				 * Number of flows for NFS/UDP protocol
				 */
				nfs_udp?: number;
				/**
				 * Number of flows for NTP
				 */
				ntp?: number;
				/**
				 * Number of flows for PostgreSQL protocol
				 */
				pgsql?: number;
				pop3?: number;
				/**
				 * Number of flows for QUIC protocol
				 */
				quic?: number;
				/**
				 * Number of flows for RDP
				 */
				rdp?: number;
				/**
				 * Number of flows for RFB protocol
				 */
				rfb?: number;
				/**
				 * Number of flows for SIP/TCP protocol
				 */
				sip_tcp?: number;
				/**
				 * Number of flows for SIP/UDP protocol
				 */
				sip_udp?: number;
				/**
				 * Number of flows for SMB protocol
				 */
				smb?: number;
				/**
				 * Number of flows for SMTP
				 */
				smtp?: number;
				/**
				 * Number of flows for SNMP
				 */
				snmp?: number;
				/**
				 * Number of flows for SSH protocol
				 */
				ssh?: number;
				/**
				 * Number of flows for Telnet protocol
				 */
				telnet?: number;
				/**
				 * Number of flows for TFTP
				 */
				tftp?: number;
				/**
				 * Number of flows for TLS protocol
				 */
				tls?: number;
				websocket?: number;
			};
			tx?: {
				/**
				 * Number of transactions for BitTorrent DHT protocol
				 */
				bittorrent_dht?: number;
				/**
				 * Number of transactions for DCERPC/TCP protocol
				 */
				dcerpc_tcp?: number;
				/**
				 * Number of transactions for DCERPC/UDP protocol
				 */
				dcerpc_udp?: number;
				/**
				 * Number of transactions for DHCP
				 */
				dhcp?: number;
				/**
				 * Number of transactions for DNP3
				 */
				dnp3?: number;
				/**
				 * Number of transactions for DNS/TCP protocol
				 */
				dns_tcp?: number;
				/**
				 * Number of transactions for DNS/UDP protocol
				 */
				dns_udp?: number;
				doh2?: number;
				/**
				 * Number of transactions for ENIP/TCP
				 */
				enip_tcp?: number;
				/**
				 * Number of transactions for ENIP/UDP
				 */
				enip_udp?: number;
				/**
				 * Number of transactions for FTP
				 */
				ftp?: number;
				/**
				 * Number of transactions for FTP data protocol
				 */
				ftp_data?: number;
				/**
				 * Number of transactions for HTTP
				 */
				http?: number;
				/**
				 * Number of transactions for HTTP/2
				 */
				http2?: number;
				/**
				 * Number of transactions for IKE protocol
				 */
				ike?: number;
				/**
				 * Number of transactions for IKE v2 protocol
				 */
				ikev2?: number;
				/**
				 * Number of transactions for IMAP
				 */
				imap?: number;
				/**
				 * Number of transactions for Kerberos v5/TCP protocol
				 */
				krb5_tcp?: number;
				/**
				 * Number of transactions for Kerberos v5/UDP protocol
				 */
				krb5_udp?: number;
				/**
				 * Number of transactions for LDAP/TCP protocol
				 */
				ldap_tcp?: number;
				/**
				 * Number of transactions for LDAP/UDP protocol
				 */
				ldap_udp?: number;
				/**
				 * Number of transactions for LLMNR/TCP protocol
				 */
				llmnr_tcp?: number;
				/**
				 * Number of transactions for LLMNR/UDP protocol
				 */
				llmnr_udp?: number;
				/**
				 * Number of transactions for mDNS
				 */
				mdns?: number;
				/**
				 * Number of transactions for Modbus protocol
				 */
				modbus?: number;
				/**
				 * Number of transactions for MQTT protocol
				 */
				mqtt?: number;
				/**
				 * Number of transactions for NFS/TCP protocol
				 */
				nfs_tcp?: number;
				/**
				 * Number of transactions for NFS/UDP protocol
				 */
				nfs_udp?: number;
				/**
				 * Number of transactions for NTP
				 */
				ntp?: number;
				/**
				 * Number of transactions for PostgreSQL protocol
				 */
				pgsql?: number;
				pop3?: number;
				/**
				 * Number of transactions for QUIC protocol
				 */
				quic?: number;
				/**
				 * Number of transactions for RDP
				 */
				rdp?: number;
				/**
				 * Number of transactions for RFB protocol
				 */
				rfb?: number;
				/**
				 * Number of transactions for SIP/TCP protocol
				 */
				sip_tcp?: number;
				/**
				 * Number of transactions for SIP/UDP protocol
				 */
				sip_udp?: number;
				/**
				 * Number of transactions for SMB protocol
				 */
				smb?: number;
				/**
				 * Number of transactions for SMTP
				 */
				smtp?: number;
				/**
				 * Number of transactions for SNMP
				 */
				snmp?: number;
				/**
				 * Number of transactions for SSH protocol
				 */
				ssh?: number;
				/**
				 * Number of transactions for Telnet protocol
				 */
				telnet?: number;
				/**
				 * Number of transactions for TFTP
				 */
				tftp?: number;
				/**
				 * Number of transactions for TLS protocol
				 */
				tls?: number;
				websocket?: number;
			};
		};
		/**
		 * Observational statistics for packet capture module
		 */
		capture?: {
			/**
			 * Statistics for AF_PACKET capture module
			 */
			afpacket?: {
				busy_loop_avg?: number;
				poll_data?: number;
				poll_errors?: number;
				poll_signal?: number;
				poll_timeout?: number;
				polls?: number;
				send_errors?: number;
			};
			/**
			 * Number of Suricata errors reported while reading capture module
			 */
			errors?: number;
			/**
			 * Number of packets dropped by the kernel
			 */
			kernel_drops?: number;
			/**
			 * Number of packets dropped by the interface
			 */
			kernel_ifdrops?: number;
			/**
			 * Number of packets received from the kernel
			 */
			kernel_packets?: number;
		};
		/**
		 * Statistics for packet decoding engine
		 */
		decoder?: {
			/**
			 * Number of ARP packets decoded
			 */
			arp?: number;
			/**
			 * Average packet size decoded
			 */
			avg_pkt_size?: number;
			/**
			 * Number of bytes decoded by the engine
			 */
			bytes?: number;
			/**
			 * Number of Cisco HDLC packets decoded
			 */
			chdlc?: number;
			/**
			 * Number of ERSPAN packets decoded
			 */
			erspan?: number;
			/**
			 * Number of ESP packets decoded
			 */
			esp?: number;
			/**
			 * Number of ETAG packets decoded
			 */
			etag?: number;
			/**
			 * Number of Ethernet packets decoded
			 */
			ethernet?: number;
			/**
			 * Statistics on events raised during packet decoding
			 */
			event?: {
				afpacket?: {
					/**
					 * Number of packets truncated by AF_PACKET
					 */
					trunc_pkt?: number;
				};
				arp?: {
					/**
					 * Number of ARP packets with invalid hardware size (valid size is 6)
					 */
					invalid_hardware_size?: number;
					/**
					 * Number of invalid decoded ARP packets
					 */
					invalid_pkt?: number;
					/**
					 * Number of ARP packets with invalid protocol size (valid size is 4)
					 */
					invalid_protocol_size?: number;
					/**
					 * Number of ARP packets with header length too small
					 */
					pkt_too_small?: number;
					/**
					 * Number of ARP packets with unsupported hardware
					 */
					unsupported_hardware?: number;
					/**
					 * Number of ARP packets with unsupported Operation Codes
					 */
					unsupported_opcode?: number;
					/**
					 * Number of ARP packets with unsupported protocol
					 */
					unsupported_protocol?: number;
				};
				chdlc?: {
					/**
					 * Number of packets too small for CHDLC
					 */
					pkt_too_small?: number;
				};
				dce?: {
					/**
					 * Number of packets too small for DCE
					 */
					pkt_too_small?: number;
				};
				erspan?: {
					/**
					 * Number of packets with header too small for ERSPAN
					 */
					header_too_small?: number;
					/**
					 * Number of packets with too many VLAN layers for ERSPAN
					 */
					too_many_vlan_layers?: number;
					/**
					 * Number of packets with unsupported version for ERSPAN
					 */
					unsupported_version?: number;
				};
				esp?: {
					/**
					 * Number of packets too small for ESP
					 */
					pkt_too_small?: number;
				};
				etag?: {
					/**
					 * Number of packets with header too small for ETAG
					 */
					header_too_small?: number;
					/**
					 * Number of ETAG packets with unknown type
					 */
					unknown_type?: number;
				};
				ethernet?: {
					/**
					 * Number of packets too small for Ethernet
					 */
					pkt_too_small?: number;
					/**
					 * Number of packets with Unkonwn Ethertype for Ethernet
					 */
					unknown_ethertype?: number;
				};
				geneve?: {
					/**
					 * Number of packets with unknown payload type for Geneve
					 */
					unknown_payload_type?: number;
				};
				gre?: {
					/**
					 * Number of packets too small for GRE
					 */
					pkt_too_small?: number;
					/**
					 * Number of packets with version 0 flags set for GRE
					 */
					version0_flags?: number;
					/**
					 * Number of packets with version 0 and header too big for GRE
					 */
					version0_hdr_too_big?: number;
					/**
					 * Number of packets of with version 0 and malformed SRE header for GRE
					 */
					version0_malformed_sre_hdr?: number;
					/**
					 * Number of packets with version 0 and flag recursion control set for GRE
					 */
					version0_recur?: number;
					/**
					 * Number of packets with version 1 and checksum flag set for GRE
					 */
					version1_chksum?: number;
					/**
					 * Number of packets with version 1 flags set for GRE
					 */
					version1_flags?: number;
					/**
					 * Number of packets with version 1 and header too big for GRE
					 */
					version1_hdr_too_big?: number;
					/**
					 * Number of packets with version 1 and malformed SRE header for GRE
					 */
					version1_malformed_sre_hdr?: number;
					/**
					 * Number of packets with version 1 and no key flag set for GRE
					 */
					version1_no_key?: number;
					/**
					 * Number of packets with version 1 and flag recursion control set for GRE
					 */
					version1_recur?: number;
					/**
					 * Number of packets with version 1 and flag route set for GRE
					 */
					version1_route?: number;
					/**
					 * Number of packets with version 1 and flag SSR set for GRE
					 */
					version1_ssr?: number;
					/**
					 * Number of packets with version 1 and wrong protocol set for GRE
					 */
					version1_wrong_protocol?: number;
					/**
					 * Number of packets with wrong version set for GRE
					 */
					wrong_version?: number;
				};
				icmpv4?: {
					/**
					 * Number of truncated packets for ICMPv4
					 */
					ipv4_trunc_pkt?: number;
					/**
					 * Number of ICMPv4 packets with unknown version
					 */
					ipv4_unknown_ver?: number;
					/**
					 * Number of packets too small for ICMPv4
					 */
					pkt_too_small?: number;
					/**
					 * Number of ICMPv4 packets with unknown code
					 */
					unknown_code?: number;
					/**
					 * Number of ICMPv4 packets with unknown type
					 */
					unknown_type?: number;
				};
				icmpv6?: {
					/**
					 * Number of ICMPv6 packets with private experimentation type
					 */
					experimentation_type?: number;
					/**
					 * Number of truncated ICMPv6 packets
					 */
					ipv6_trunc_pkt?: number;
					/**
					 * Number of ICMPv6 packets with unknown version
					 */
					ipv6_unknown_version?: number;
					/**
					 * Number of ICMPv6 packets with MLD messages and invalid HL (not 1)
					 */
					mld_message_with_invalid_hl?: number;
					/**
					 * Number of packets too small for ICMPv6
					 */
					pkt_too_small?: number;
					/**
					 * Number of ICMPv6 packets with unassigned type
					 */
					unassigned_type?: number;
					/**
					 * Number of ICMPv6 packets with unknown code
					 */
					unknown_code?: number;
					/**
					 * Number of ICMPv6 packets with unknown type
					 */
					unknown_type?: number;
				};
				ieee8021ah?: {
					/**
					 * Number of IEEE802.1ah packets with header too small
					 */
					header_too_small?: number;
				};
				igmp?: {
					/**
					 * IGMP with malformed data
					 */
					malformed?: number;
					/**
					 * IGMP packets too small to fit a IGMP header
					 */
					pkt_too_small?: number;
					/**
					 * IGMPv3 packets too small to fit a IGMP header
					 */
					v3_pkt_too_small?: number;
				};
				ipraw?: {
					/**
					 * Number of RAW packets with invalid IP version
					 */
					invalid_ip_version?: number;
				};
				ipv4?: {
					/**
					 * Number of IPv6 fragments ignored due to resource allocation errors
					 */
					frag_ignored?: number;
					/**
					 * Number of IPv4 fragments with overlapping data
					 */
					frag_overlap?: number;
					/**
					 * Number of IPv4 fragments ignored due to being too large
					 */
					frag_pkt_too_large?: number;
					/**
					 * Number of IPv4 packets flagged invalid due to header smaller than minimum size
					 */
					hlen_too_small?: number;
					/**
					 * Number of IPv4 packets flagged invalid due to having an ICMPV6 header
					 */
					icmpv6?: number;
					/**
					 * Number of IPv4 packets flagged invalid due to length being smaller than IP header size
					 */
					iplen_smaller_than_hlen?: number;
					/**
					 * Number of IPv4 packets with duplicated IP options
					 */
					opt_duplicate?: number;
					/**
					 * Number of IPv4 packets with 'end of list' option not present, but required, in IP options
					 */
					opt_eol_required?: number;
					/**
					 * Number of IPv4 packets with invalid IP options
					 */
					opt_invalid?: number;
					/**
					 * Number of IPv4 packets flagged invalid due to IP options with invalid length
					 */
					opt_invalid_len?: number;
					/**
					 * Number of IPv4 packets flagged invalid due to malformed IP options
					 */
					opt_malformed?: number;
					/**
					 * Number of IPv4 packets with padding bytes required in IP options
					 */
					opt_pad_required?: number;
					/**
					 * Number of IPv4 packets flagged invalid due to unknown IP option
					 */
					opt_unknown?: number;
					/**
					 * Number of IPv4 packets flagged invalid due to size smaller than minimum header size
					 */
					pkt_too_small?: number;
					/**
					 * Number of IPv4 packets flagged invalid due to truncated packet
					 */
					trunc_pkt?: number;
					/**
					 * Number of IPv4 packets with unknown protocol
					 */
					unknown_protocol?: number;
					/**
					 * Number of IPv4 packets flagged invalid due to having wrong IP version in IP options
					 */
					wrong_ip_version?: number;
				};
				ipv6?: {
					/**
					 * Number of IPv6 packets with data after the 'none' header
					 */
					data_after_none_header?: number;
					/**
					 * Number of IPv6 packets with all DST options as only padding
					 */
					dstopts_only_padding?: number;
					/**
					 * Number of IPv6 packets with unknown DST option
					 */
					dstopts_unknown_opt?: number;
					/**
					 * Number of IPv6 packets with AH header reserved fields not null
					 */
					exthdr_ah_res_not_null?: number;
					/**
					 * Number of IPv6 packets with duplicated 'authentication' header in IPv6 extension headers
					 */
					exthdr_dupl_ah?: number;
					/**
					 * Number of IPv6 packets with duplicated 'destination' header in IPv6 extension headers
					 */
					exthdr_dupl_dh?: number;
					/**
					 * Number of IPv6 packets with duplicated 'ESP' header in IPv6 extension headers
					 */
					exthdr_dupl_eh?: number;
					/**
					 * Number of IPv6 packets with duplicated 'fragment' header in IPv6 extension headers
					 */
					exthdr_dupl_fh?: number;
					/**
					 * Number of IPv6 packets with duplicated 'hop-by-hop' header in IPv6 extension headers
					 */
					exthdr_dupl_hh?: number;
					/**
					 * Number of IPv6 packets with duplicated'routing' header in IPv6 extension headers
					 */
					exthdr_dupl_rh?: number;
					/**
					 * Number of IPv6 packets flagged invalid due to invalid option length in a hop or dst extended header
					 */
					exthdr_invalid_optlen?: number;
					/**
					 * Number of IPv6 packets with useless 'fragment header' in the extended headers
					 */
					exthdr_useless_fh?: number;
					/**
					 * Number of IPv6 packets with 'fragment header' with non-zero reserved field
					 */
					fh_non_zero_reserved_field?: number;
					/**
					 * Number of IPv6 fragments ignored due to resource allocation errors
					 */
					frag_ignored?: number;
					/**
					 * Number of IPv6 fragments with invalid length
					 */
					frag_invalid_length?: number;
					/**
					 * Number of IPv6 fragments with overlapping data
					 */
					frag_overlap?: number;
					/**
					 * Number of IPv6 fragments ignored due to being too large
					 */
					frag_pkt_too_large?: number;
					/**
					 * Number of IPv6 packets with all HOP options as only padding
					 */
					hopopts_only_padding?: number;
					/**
					 * Number of IPv6 packets with unknown HOP option
					 */
					hopopts_unknown_opt?: number;
					/**
					 * Number of IPv6 packets with ICMPv4 header
					 */
					icmpv4?: number;
					/**
					 * Number of IPv4-in-IPv6 packets flagged invalid due to being too small
					 */
					ipv4_in_ipv6_too_small?: number;
					/**
					 * Number of IPv4-in-IPv6 packets with wrong IP version
					 */
					ipv4_in_ipv6_wrong_version?: number;
					/**
					 * Number of IPv6-in-IPv6 packets flagged invalid due to being too small
					 */
					ipv6_in_ipv6_too_small?: number;
					/**
					 * Number of IPv6-in-IPv6 packets with wrong IP version
					 */
					ipv6_in_ipv6_wrong_version?: number;
					/**
					 * Number of IPv6 packets flagged invalid due to size smaller than minimum header size
					 */
					pkt_too_small?: number;
					/**
					 * Number of IPv6 packets with extended header 'routing' with type 0
					 */
					rh_type_0?: number;
					/**
					 * Number of IPv6 packets flagged invalid due to truncated extension header
					 */
					trunc_exthdr?: number;
					/**
					 * Number of IPv6 packets flagged invalid due to truncated packet
					 */
					trunc_pkt?: number;
					/**
					 * Number of IPv6 packets with unknown next header
					 */
					unknown_next_header?: number;
					/**
					 * Number of IPv6 packets flagged invalid due to wrong IP version
					 */
					wrong_ip_version?: number;
					/**
					 * Number of IPv6 packets with PadN option without data (length zero)
					 */
					zero_len_padn?: number;
				};
				ltnull?: {
					pkt_too_small?: number;
					unsupported_type?: number;
				};
				mpls?: {
					bad_label_implicit_null?: number;
					bad_label_reserved?: number;
					bad_label_router_alert?: number;
					header_too_small?: number;
					pkt_too_small?: number;
					unknown_payload_type?: number;
				};
				nsh?: {
					bad_header_length?: number;
					header_too_small?: number;
					reserved_type?: number;
					unknown_payload?: number;
					unsupported_type?: number;
					unsupported_version?: number;
				};
				ppp?: {
					ip4_pkt_too_small?: number;
					ip6_pkt_too_small?: number;
					pkt_too_small?: number;
					unsup_proto?: number;
					vju_pkt_too_small?: number;
					wrong_type?: number;
				};
				pppoe?: {
					malformed_tags?: number;
					pkt_too_small?: number;
					wrong_code?: number;
				};
				sctp?: {
					/**
					 * SCTP chunk length < 4 or exceeds remaining packet
					 */
					chunk_len_invalid?: number;
					/**
					 * Remaining data too small for SCTP chunk header
					 */
					chunk_too_small?: number;
					/**
					 * SCTP DATA chunk with verification tag == 0
					 */
					data_with_zero_vtag?: number;
					/**
					 * RFC 4960 sec 6.10 violation: INIT/INIT_ACK bundled with other chunks
					 */
					init_chunk_bundled?: number;
					/**
					 * SCTP INIT with verification tag != 0
					 */
					init_with_non_zero_vtag?: number;
					/**
					 * SCTP packet smaller than minimum size
					 */
					pkt_too_small?: number;
					/**
					 * More chunks than SCTP_MAX_TRACKED_CHUNKS
					 */
					too_many_chunks?: number;
					/**
					 * More DATA chunks than SCTP_MAX_DATA_CHUNKS
					 */
					too_many_data_chunks?: number;
				};
				sll?: {
					/**
					 * Number of SLL decoded packets that were too small
					 */
					pkt_too_small?: number;
				};
				sll2?: {
					/**
					 * The number of times the SLL2 header was too small to be valid
					 */
					pkt_too_small?: number;
				};
				tcp?: {
					hlen_too_small?: number;
					invalid_optlen?: number;
					opt_duplicate?: number;
					opt_invalid_len?: number;
					pkt_too_small?: number;
				};
				udp?: {
					hlen_invalid?: number;
					hlen_too_small?: number;
					len_invalid?: number;
					pkt_too_small?: number;
				};
				vlan?: {
					header_too_small?: number;
					too_many_layers?: number;
					unknown_type?: number;
				};
				vntag?: {
					header_too_small?: number;
					unknown_type?: number;
				};
				vxlan?: {
					unknown_payload_type?: number;
				};
			};
			/**
			 * Number of GENEVE packets decoded
			 */
			geneve?: number;
			/**
			 * Number of GRE packets decoded
			 */
			gre?: number;
			/**
			 * Number of ICMPv4 packets decoded
			 */
			icmpv4?: number;
			/**
			 * Number of ICMPv6 packets decoded
			 */
			icmpv6?: number;
			/**
			 * Number of IEEE802.1ah packets decoded
			 */
			ieee8021ah?: number;
			/**
			 * Number of IGMP packets decoded
			 */
			igmp?: number;
			/**
			 * Number of invalid packets decoded
			 */
			invalid?: number;
			/**
			 * Number of IPv4 packets decoded
			 */
			ipv4?: number;
			/**
			 * Number of IPv4 in IPv4 packets decoded
			 */
			ipv4_in_ipv4?: number;
			/**
			 * Number of IPv4 in IPv6 packets decoded
			 */
			ipv4_in_ipv6?: number;
			/**
			 * Number of IPv6 packets decoded
			 */
			ipv6?: number;
			/**
			 * Number of IPv6 in IPv4 packets decoded
			 */
			ipv6_in_ipv4?: number;
			/**
			 * Number of IPv6 in IPv6 packets decoded
			 */
			ipv6_in_ipv6?: number;
			/**
			 * Maximum amount of destination MAC addresses seen per flow (only if ethernet header logging enabled)
			 */
			max_mac_addrs_dst?: number;
			/**
			 * Maximum amount of source MAC addresses seen per flow (only if ethernet header logging enabled)
			 */
			max_mac_addrs_src?: number;
			/**
			 * Maximum packet size decoded by the engine
			 */
			max_pkt_size?: number;
			/**
			 * Number of MPLS packets decoded
			 */
			mpls?: number;
			/**
			 * Number of NSH packets decoded
			 */
			nsh?: number;
			/**
			 * Number of LINKTYPE_NULL packets decoded
			 */
			null?: number;
			/**
			 * Number of packets decoded
			 */
			pkts?: number;
			/**
			 * Number of PPP packets decoded
			 */
			ppp?: number;
			/**
			 * Number of PPPOE packets decoded
			 */
			pppoe?: number;
			/**
			 * Number of RAW packets decoded
			 */
			raw?: number;
			/**
			 * Number of STCP packets decoded
			 */
			sctp?: number;
			/**
			 * Number of SLL packets decoded
			 */
			sll?: number;
			/**
			 * The number of SLL2 frames encountered
			 */
			sll2?: number;
			/**
			 * Number of TCP packets decoded
			 */
			tcp?: number;
			/**
			 * Number of Teredo packets decoded
			 */
			teredo?: number;
			/**
			 * Number of decoded packets that reach maximum layers for the engine
			 */
			too_many_layers?: number;
			/**
			 * Number of UDP packets decoded
			 */
			udp?: number;
			/**
			 * Number of decoded packets with unknown ethertype
			 */
			unknown_ethertype?: number;
			/**
			 * Number of VLAN layer 2 packets decoded
			 */
			vlan?: number;
			/**
			 * Number of VLAN layer 2 (Q-in-Q) packets decoded
			 */
			vlan_qinq?: number;
			/**
			 * Number of VLAN layer 3 (Q-in-Q-in-Q) packets decoded
			 */
			vlan_qinqinq?: number;
			/**
			 * Number of VNTAG packets decoded
			 */
			vntag?: number;
			/**
			 * Number of VXLAN packets decoded
			 */
			vxlan?: number;
		};
		/**
		 * Statistics on IP (de)fragmentation
		 */
		defrag?: {
			ipv4?: {
				fragments?: number;
				reassembled?: number;
				timeouts?: number;
			};
			ipv6?: {
				fragments?: number;
				reassembled?: number;
				timeouts?: number;
			};
			/**
			 * How many times a fragment wasn't stored due to max-frags limit being reached
			 */
			max_frags_reached?: number;
			/**
			 * How many times a packet wasn't reassembled due to max-trackers limit being reached
			 */
			max_trackers_reached?: number;
			/**
			 * Current memory use.
			 */
			memuse?: number;
			mgr?: {
				tracker_timeout?: number;
			};
			/**
			 * Active tracker force closed before completion and reused for new tracker
			 */
			tracker_hard_reuse?: number;
			/**
			 * Finished tracker re-used from hash table before being moved to spare pool
			 */
			tracker_soft_reuse?: number;
			wrk?: {
				tracker_timeout?: number;
			};
		};
		/**
		 * Statistics related to the detection engines
		 */
		detect?: {
			/**
			 * Count of alerts triggered
			 */
			alert?: number;
			/**
			 * Count of alerts discarded due to alert queue overflow
			 */
			alert_queue_overflow?: number;
			/**
			 * Count of alerts not logged due to noalert keyword usage or thresholding
			 */
			alerts_suppressed?: number;
			engines?: [
				{
					/**
					 * If multi-tenancy is enabled, the tenant id
					 */
					id?: number;
					/**
					 * Last time the rules were reloaded, in TimeString format
					 */
					last_reload?: string;
					/**
					 * Count of rules that failed to load
					 */
					rules_failed?: number;
					/**
					 * Count of rules successfully loaded
					 */
					rules_loaded?: number;
					/**
					 * Count of rules that were skipped due to missing requirements
					 */
					rules_skipped?: number;
				},
				...{
					/**
					 * If multi-tenancy is enabled, the tenant id
					 */
					id?: number;
					/**
					 * Last time the rules were reloaded, in TimeString format
					 */
					last_reload?: string;
					/**
					 * Count of rules that failed to load
					 */
					rules_failed?: number;
					/**
					 * Count of rules successfully loaded
					 */
					rules_loaded?: number;
					/**
					 * Count of rules that were skipped due to missing requirements
					 */
					rules_skipped?: number;
				}[]
			];
			lua?: {
				/**
				 * Counter for Lua scripts failing due to blocked functions being called
				 */
				blocked_function_errors?: number;
				/**
				 * Errors encountered while running Lua scripts
				 */
				errors?: number;
				/**
				 * Count of Lua rules exceeding the instruction limit
				 */
				instruction_limit_errors?: number;
				/**
				 * Count of Lua rules exceeding the memory limit
				 */
				memory_limit_errors?: number;
			};
			/**
			 * If profiling is enabled, average count of signature matched against a packet
			 */
			match_list?: number;
			/**
			 * If profiling is enabled, average count of signatures in the mpm prefilter list
			 */
			mpm_list?: number;
			thresholds?: {
				/**
				 * Count of bitmap allocation failures
				 */
				bitmap_alloc_fail?: number;
				/**
				 * Memory usage by detection_filter bitmaps
				 */
				bitmap_memuse?: number;
				/**
				 * Memory cap for threshold hash table
				 */
				memcap?: number;
				/**
				 * Memory usage by threshold hash table
				 */
				memuse?: number;
			};
		};
		/**
		 * Statistics on exception policies hit and applied
		 */
		exception_policy?: {
			app_layer?: {
				/**
				 * Consolidated stats on how many times app-layer error exception policy was applied, and which one
				 */
				error?: {
					bypass?: number;
					drop_flow?: number;
					drop_packet?: number;
					pass_flow?: number;
					pass_packet?: number;
					reject?: number;
					reject_both?: number;
				};
			};
			defrag?: {
				/**
				 * How many times defrag memcap exception policy was applied, and which one
				 */
				memcap?: {
					bypass?: number;
					drop_flow?: number;
					drop_packet?: number;
					pass_flow?: number;
					pass_packet?: number;
					reject?: number;
					reject_both?: number;
				};
			};
			flow?: {
				/**
				 * How many times flow memcap exception policy was applied, and which one
				 */
				memcap?: {
					bypass?: number;
					drop_flow?: number;
					drop_packet?: number;
					pass_flow?: number;
					pass_packet?: number;
					reject?: number;
					reject_both?: number;
				};
			};
			tcp?: {
				/**
				 * How many times midstream exception policy was applied, and which one
				 */
				midstream?: {
					bypass?: number;
					drop_flow?: number;
					drop_packet?: number;
					pass_flow?: number;
					pass_packet?: number;
					reject?: number;
					reject_both?: number;
				};
				/**
				 * How many times reassembly memcap exception policy was applied, and which one
				 */
				reassembly?: {
					bypass?: number;
					drop_flow?: number;
					drop_packet?: number;
					pass_flow?: number;
					pass_packet?: number;
					reject?: number;
					reject_both?: number;
				};
				/**
				 * How many times session memcap exception policy was applied, and which one
				 */
				ssn_memcap?: {
					bypass?: number;
					drop_flow?: number;
					drop_packet?: number;
					pass_flow?: number;
					pass_packet?: number;
					reject?: number;
					reject_both?: number;
				};
			};
		};
		/**
		 * Performance-related statistics for the file storing module
		 */
		file_store?: {
			fs_errors?: number;
			open_files?: number;
			open_files_max_hit?: number;
		};
		firewall?: {
			/**
			 * Count of accepted packets due to firewall policies
			 */
			accepted?: number;
			/**
			 * Count of blocked packets due to firewall policies
			 */
			blocked?: number;
			/**
			 * Count of alerts discarded due max alerts reached
			 */
			discarded_alerts?: number;
			drop_reason?: {
				/**
				 * Count of packets dropped due to firewall's mode default app policy
				 */
				default_app_policy?: number;
				/**
				 * Count of packets dropped due to firewall's mode default packet policy
				 */
				default_packet_policy?: number;
				/**
				 * Count of packets dropped due to a firewall policy that led to flow drop
				 */
				flow_drop?: number;
				/**
				 * Count of packets dropped due to pre-flow hook
				 */
				pre_flow_hook?: number;
				/**
				 * Count of packets dropped due to pre-stream hook
				 */
				pre_stream_hook?: number;
				/**
				 * Count of packets dropped due to firewall rules
				 */
				rules?: number;
			};
			/**
			 * Count of packets rejected due to firewall policies
			 */
			rejected?: number;
		};
		/**
		 * Stats on flow-related diagnostics
		 */
		flow?: {
			/**
			 * Number of currently active flows
			 */
			active?: number;
			/**
			 * Total number of elephant flows
			 */
			elephant?: number;
			/**
			 * Total number of elephant flows in toclient direction
			 */
			elephant_toclient?: number;
			/**
			 * Total number of elephant flows in toserver direction
			 */
			elephant_toserver?: number;
			/**
			 * Number of times emergency mode was entered
			 */
			emerg_mode_entered?: number;
			/**
			 * Number of times recovery was made from emergency mode
			 */
			emerg_mode_over?: number;
			end?: {
				state?: {
					/**
					 * Number of flows bypassed at the capture level -- counted at the time of flow end
					 */
					capture_bypassed?: number;
					/**
					 * Number of flows in 'closed' state at the time of flow end
					 */
					closed?: number;
					/**
					 * Number of flows in 'established' state at the time of flow end
					 */
					established?: number;
					/**
					 * Number of flows bypassed internally -- counted at the time of flow end
					 */
					local_bypassed?: number;
					/**
					 * Number of flows in 'new' state at the time of flow end
					 */
					new?: number;
				};
				/**
				 * Number of TCP flows ended that had liberal state
				 */
				tcp_liberal?: number;
				tcp_state?: {
					/**
					 * Number of TCP sessions in CLOSE_WAIT state
					 */
					close_wait?: number;
					/**
					 * Number of TCP sessions in CLOSED state
					 */
					closed?: number;
					/**
					 * Number of TCP sessions in CLOSING state
					 */
					closing?: number;
					/**
					 * Number of TCP sessions in ESTABLISHED state
					 */
					established?: number;
					/**
					 * Number of TCP sessions in FIN_WAIT_1 state
					 */
					fin_wait1?: number;
					/**
					 * Number of TCP sessions in FIN_WAIT_2 state
					 */
					fin_wait2?: number;
					/**
					 * Number of TCP sessions in LAST_ACK state
					 */
					last_ack?: number;
					/**
					 * Number of TCP sessions newly created
					 */
					none?: number;
					/**
					 * Number of TCP sessions in SYN_RECV state
					 */
					syn_recv?: number;
					/**
					 * Number of TCP sessions in SYN_SENT state
					 */
					syn_sent?: number;
					/**
					 * Number of TCP sessions in TIME_WAIT state
					 */
					time_wait?: number;
				};
			};
			/**
			 * Number of reused flows from the hash table in case memcap was reached and spare pool was empty
			 */
			get_used?: number;
			/**
			 * Number of attempts at getting a flow directly from the hash
			 */
			get_used_eval?: number;
			/**
			 * Number of times a flow was found in the hash but the lock for hash bucket could not be obtained
			 */
			get_used_eval_busy?: number;
			/**
			 * Number of flows that were evaluated but rejected from reuse as they were still alive/active
			 */
			get_used_eval_reject?: number;
			/**
			 * Number of times retrieval of flow from hash was attempted but was unsuccessful
			 */
			get_used_failed?: number;
			/**
			 * Number of ICMPv4 flows
			 */
			icmpv4?: number;
			/**
			 * Number of ICMPv6 flows
			 */
			icmpv6?: number;
			/**
			 * Number of times memcap was reached for flows
			 */
			memcap?: number;
			/**
			 * Memory currently in use by the flows
			 */
			memuse?: number;
			/**
			 * Flow manager stats counters
			 */
			mgr?: {
				/**
				 * Number of flows checked for timeout in the last pass
				 */
				flows_checked?: number;
				/**
				 * Number of flows that were evicted
				 */
				flows_evicted?: number;
				/**
				 * Number of TCP flows that were returned to the workers in case reassembly, detection, logging still needs work
				 */
				flows_evicted_needs_work?: number;
				/**
				 * Number of flows that did not time out
				 */
				flows_notimeout?: number;
				/**
				 * Number of flows that reached the time out
				 */
				flows_timeout?: number;
				/**
				 * Number of times a full pass of the hash table was done
				 */
				full_hash_pass?: number;
				/**
				 * Size of the biggest row in the hash table
				 */
				rows_maxlen?: number;
				/**
				 * Number of rows to be scanned every second by a worker
				 */
				rows_per_sec?: number;
			};
			recycler?: {
				/**
				 * Average number of recycled flows per queue
				 */
				queue_avg?: number;
				/**
				 * Maximum number of recycled flows per queue
				 */
				queue_max?: number;
				/**
				 * Number of recycled flows
				 */
				recycled?: number;
			};
			/**
			 * Number of flows in the spare pool
			 */
			spare?: number;
			/**
			 * Number of TCP flows
			 */
			tcp?: number;
			/**
			 * Number of TCP flows that were reused as they seemed to share the same flow tuple
			 */
			tcp_reuse?: number;
			/**
			 * Total number of flows
			 */
			total?: number;
			/**
			 * Number of UDP flows
			 */
			udp?: number;
			/**
			 * Flow worker threads stats
			 */
			wrk?: {
				/**
				 * Number of flows that were evicted
				 */
				flows_evicted?: number;
				/**
				 * Number of TCP flows that were returned to the workers in case reassembly, detection, logging still needs work
				 */
				flows_evicted_needs_work?: number;
				/**
				 * Number of pseudo packets injected into worker threads to complete flows' processing. For any flow this can be between 0-2, this is the total for all flows.
				 */
				flows_evicted_pkt_inject?: number;
				/**
				 * Number of flows injected into the worker thread from another thread
				 */
				flows_injected?: number;
				/**
				 * Maximum number of flows injected into the worker thread from another thread
				 */
				flows_injected_max?: number;
				/**
				 * Number of times the engine attempted to fetch flows from the master flow pool/spare queue
				 */
				spare_sync?: number;
				/**
				 * Average number of flows a thread could fetch from the master flow pool/spare queue
				 */
				spare_sync_avg?: number;
				/**
				 * Number of times the master spare pool was empty when requesting flows from it
				 */
				spare_sync_empty?: number;
				/**
				 * Number of times spare flow syncs were incomplete (fetched with less than 100 flows in sync)
				 */
				spare_sync_incomplete?: number;
			};
		};
		/**
		 * Observational statistics on flow bypassing
		 */
		flow_bypassed?: {
			bytes?: number;
			closed?: number;
			local_bytes?: number;
			local_capture_bytes?: number;
			local_capture_pkts?: number;
			local_pkts?: number;
			pkts?: number;
		};
		/**
		 * Performance statistics for global memory use and memory capacity for FTP app-layer parser
		 */
		ftp?: {
			/**
			 * Global memory capacity reached for FTP parser
			 */
			memcap?: number;
			/**
			 * Global memory usage for FTP parser
			 */
			memuse?: number;
		};
		/**
		 * Performance statistics for global memory use and memory capacity for Host table
		 */
		host?: {
			/**
			 * Global memory capacity reached for Host table
			 */
			memcap?: number;
			/**
			 * Global memory usage for Host table
			 */
			memuse?: number;
		};
		/**
		 * Performance statistics for global memory use and memory capacity for HTTP app-layer parser
		 */
		http?: {
			byterange?: {
				/**
				 * Global memory capacity reached for Byte Range containers
				 */
				memcap?: number;
				/**
				 * Global memory usage for Byte Range containers
				 */
				memuse?: number;
			};
			/**
			 * Global memory capacity reached for HTTP parser
			 */
			memcap?: number;
			/**
			 * Global memory usage for HTTP parser
			 */
			memuse?: number;
		};
		/**
		 * Performance statistics for global memory use and memory capacity for IP Pair table
		 */
		ippair?: {
			/**
			 * Global memory capacity reached for IP Pair table
			 */
			memcap?: number;
			/**
			 * Global memory usage for IP Pair table
			 */
			memuse?: number;
		};
		/**
		 * Statistics for IPS mode
		 */
		ips?: {
			/**
			 * Number of accepted packets
			 */
			accepted?: number;
			/**
			 * Number of blocked packets
			 */
			blocked?: number;
			/**
			 * Number of dropped packets, grouped by drop reason
			 */
			drop_reason?: {
				/**
				 * Number of packets dropped due to app-layer error exception policy
				 */
				applayer_error?: number;
				/**
				 * Number of packets dropped due to applayer memcap
				 */
				applayer_memcap?: number;
				/**
				 * Number of packets dropped due to decoding errors
				 */
				decode_error?: number;
				/**
				 * Number of packets dropped due to defragmentation errors
				 */
				defrag_error?: number;
				/**
				 * Number of packets dropped due to defrag memcap exception policy
				 */
				defrag_memcap?: number;
				/**
				 * Number of packets dropped due to an exception policy flow dropping
				 */
				exception_policy_flow_drop?: number;
				/**
				 * Number of packets dropped due to dropped flows
				 */
				flow_drop?: number;
				/**
				 * Number of packets dropped due to flow memcap exception policy
				 */
				flow_memcap?: number;
				/**
				 * Number of packets dropped due to no NFQ verdict
				 */
				nfq_error?: number;
				/**
				 * Number of packets dropped due to rule actions
				 */
				rules?: number;
				/**
				 * Number of packets dropped due to invalid TCP stream
				 */
				stream_error?: number;
				/**
				 * Number of packets dropped due to stream memcap exception policy
				 */
				stream_memcap?: number;
				/**
				 * Number of packets dropped due to stream midstream exception policy
				 */
				stream_midstream?: number;
				/**
				 * Number of packets dropped due to stream reassembly exception policy
				 */
				stream_reassembly?: number;
				/**
				 * Number of packets dropped due to TCP urgent flag
				 */
				stream_urgent?: number;
				/**
				 * Number of packets dropped due to threshold detection filter
				 */
				threshold_detection_filter?: number;
				/**
				 * Number of packets dropped due to inner tunnel packet being dropped
				 */
				tunnel_packet_drop?: number;
			};
			/**
			 * Number of rejected packets
			 */
			rejected?: number;
			/**
			 * Number of packets replaced by the stream engine or based on a match of the 'replaced' keyword.
			 */
			replaced?: number;
		};
		/**
		 * Performance statistics on global memory capacity / usage. Calculated for flow, stream, stream-reassembly, app-layer http, defrag, ippair and host
		 */
		memcap?: {
			/**
			 * Percentage of memcaps used by flow, stream, stream-reassembly and app-layer-http
			 */
			pressure?: number;
			/**
			 * Maximum pressure seen by the engine
			 */
			pressure_max?: number;
		};
		/**
		 * Statistics for pcap logging
		 */
		pcap_log?: {
			/**
			 * Number of packets filtered out by bpf (not written)
			 */
			filtered_bpf?: number;
			/**
			 * Number of packets written
			 */
			written?: number;
		};
		/**
		 * Statistics on SCTP chunk types
		 */
		sctp?: {
			/**
			 * Number of SCTP packets with ABORT chunk
			 */
			abort?: number;
			/**
			 * Number of SCTP packets with DATA chunk
			 */
			data?: number;
			/**
			 * Number of SCTP packets with INIT chunk
			 */
			init?: number;
			/**
			 * Number of SCTP packets with INIT_ACK chunk
			 */
			init_ack?: number;
			/**
			 * Number of SCTP packets with SHUTDOWN chunk
			 */
			shutdown?: number;
		};
		/**
		 * Observational statistics on TCP stream events
		 */
		stream?: {
			'3whs_ack_data_inject'?: number;
			'3whs_ack_in_wrong_dir'?: number;
			'3whs_async_wrong_seq'?: number;
			'3whs_right_seq_wrong_ack_evasion'?: number;
			'3whs_syn_flood'?: number;
			'3whs_syn_resend_diff_seq_on_syn_recv'?: number;
			'3whs_syn_toclient_on_syn_recv'?: number;
			'3whs_synack_flood'?: number;
			'3whs_synack_in_wrong_direction'?: number;
			'3whs_synack_resend_with_diff_ack'?: number;
			'3whs_synack_resend_with_diff_seq'?: number;
			'3whs_synack_tfo_data_ignored'?: number;
			'3whs_synack_toserver_on_syn_recv'?: number;
			'3whs_synack_with_wrong_ack'?: number;
			'3whs_wrong_seq_wrong_ack'?: number;
			'4whs_invalid_ack'?: number;
			'4whs_synack_with_wrong_ack'?: number;
			'4whs_synack_with_wrong_syn'?: number;
			'4whs_wrong_seq'?: number;
			closewait_ack_out_of_window?: number;
			closewait_fin_out_of_window?: number;
			closewait_invalid_ack?: number;
			closewait_pkt_before_last_ack?: number;
			closing_ack_wrong_seq?: number;
			closing_invalid_ack?: number;
			est_ack_zwp_data?: number;
			est_invalid_ack?: number;
			est_packet_out_of_window?: number;
			est_pkt_before_last_ack?: number;
			est_syn_resend?: number;
			est_syn_resend_diff_seq?: number;
			est_syn_toclient?: number;
			est_synack_resend?: number;
			est_synack_resend_with_diff_ack?: number;
			est_synack_resend_with_diff_seq?: number;
			est_synack_toserver?: number;
			fin1_ack_wrong_seq?: number;
			fin1_fin_wrong_seq?: number;
			fin1_invalid_ack?: number;
			fin2_ack_wrong_seq?: number;
			fin2_fin_wrong_seq?: number;
			fin2_invalid_ack?: number;
			fin_but_no_session?: number;
			fin_invalid_ack?: number;
			fin_out_of_window?: number;
			fin_syn?: number;
			lastack_ack_wrong_seq?: number;
			lastack_invalid_ack?: number;
			pkt_bad_window_update?: number;
			pkt_broken_ack?: number;
			pkt_invalid_ack?: number;
			pkt_invalid_timestamp?: number;
			pkt_retransmission?: number;
			pkt_spurious_retransmission?: number;
			reassembly_depth_reached?: number;
			reassembly_insert_invalid?: number;
			reassembly_insert_limit?: number;
			reassembly_insert_memcap?: number;
			reassembly_no_segment?: number;
			reassembly_overlap_different_data?: number;
			reassembly_segment_before_base_seq?: number;
			reassembly_seq_gap?: number;
			reassembly_urgent_oob_limit_reached?: number;
			rst_but_no_session?: number;
			rst_invalid_ack?: number;
			rst_with_data?: number;
			shutdown_syn_resend?: number;
			suspected_rst_inject?: number;
			timewait_ack_wrong_seq?: number;
			timewait_invalid_ack?: number;
			wrong_thread?: number;
		};
		/**
		 * Statistics on TCP stream tracking and reassembly
		 */
		tcp?: {
			ack_unseen_data?: number;
			active_sessions?: number;
			insert_data_normal_fail?: number;
			insert_data_overlap_fail?: number;
			invalid_checksum?: number;
			memuse?: number;
			midstream_pickups?: number;
			no_flow?: number;
			overlap?: number;
			overlap_diff_data?: number;
			pkt_on_wrong_thread?: number;
			pseudo?: number;
			reassembly_gap?: number;
			reassembly_memuse?: number;
			rst?: number;
			segment_from_cache?: number;
			segment_from_pool?: number;
			segment_memcap_drop?: number;
			sessions?: number;
			ssn_from_cache?: number;
			ssn_from_pool?: number;
			ssn_memcap_drop?: number;
			stream_depth_reached?: number;
			syn?: number;
			synack?: number;
			/**
			 * Number of TCP packets with the urgent flag set
			 */
			urg?: number;
			/**
			 * Number of OOB bytes tracked in TCP urgent handling
			 */
			urgent_oob_data?: number;
		};
		/**
		 * Suricata engine's uptime
		 */
		uptime?: number;
	};
	stream?: number;
	stream_tcp?: {
		[k: string]: unknown;
	};
	/**
	 * Transaction type or sub state.
	 */
	sub_state?: string;
	suricata_version?: string;
	tc_progress?: string;
	tcp?: {
		ack?: boolean;
		cwr?: boolean;
		ecn?: boolean;
		fin?: boolean;
		psh?: boolean;
		rst?: boolean;
		state?: string;
		syn?: boolean;
		tc_gap?: boolean;
		tc_max_regions?: number;
		/**
		 * Number of Out-of-Band bytes sent by server using TCP urgent packets
		 */
		tc_urgent_oob_data?: number;
		tcp_flags?: string;
		tcp_flags_tc?: string;
		tcp_flags_ts?: string;
		ts_gap?: boolean;
		ts_max_regions?: number;
		/**
		 * Number of Out-of-Band bytes sent by client using TCP urgent packets
		 */
		ts_urgent_oob_data?: number;
		urg?: boolean;
	};
	template?: {
		request?: string;
		response?: string;
	};
	tftp?: {
		file?: string;
		mode?: string;
		packet?: string;
	};
	timestamp: string;
	tls?: {
		certificate?: string;
		chain?: [string, ...string[]];
		client?: {
			certificate?: string;
			chain?: [string, ...string[]];
			fingerprint?: string;
			issuerdn?: string;
			notafter?: string;
			notbefore?: string;
			serial?: string;
			subject?: string;
			/**
			 * TLS Subject Alternative Name field
			 */
			subjectaltname?: string[];
		};
		/**
		 * TLS client ALPN field(s)
		 */
		client_alpns?: string[];
		client_handshake?: {
			/**
			 * TLS client cipher(s)
			 */
			ciphers?: [number, ...number[]];
			/**
			 * TLS client extension(s)
			 */
			exts?: [number, ...number[]];
			/**
			 * TLS client signature algorithm(s)
			 */
			sig_algs?: [number, ...number[]];
			/**
			 * TLS version in client hello
			 */
			version?: string;
		};
		fingerprint?: string;
		from_proto?: string;
		issuerdn?: string;
		ja3?: {
			hash?: string;
			string?: string;
		};
		ja3s?: {
			hash?: string;
			string?: string;
		};
		ja4?: string;
		notafter?: string;
		notbefore?: string;
		serial?: string;
		/**
		 * TLS server ALPN field(s)
		 */
		server_alpns?: string[];
		server_handshake?: {
			/**
			 * TLS server's chosen cipher
			 */
			cipher?: number;
			/**
			 * TLS server extension(s)
			 */
			exts?: [number, ...number[]];
			/**
			 * TLS version in server hello
			 */
			version?: string;
		};
		session_resumed?: boolean;
		sni?: string;
		subject?: string;
		/**
		 * TLS Subject Alternative Name field
		 */
		subjectaltname?: string[];
		version?: string;
	};
	traffic?: {
		id?: [string, ...string[]];
		label?: [string, ...string[]];
	};
	ts_progress?: string;
	tunnel?: {
		depth?: number;
		dest_ip?: string;
		dest_port?: number;
		pcap_cnt?: number;
		pkt_src?: string;
		proto?: string;
		src_ip?: string;
		src_port?: number;
	};
	/**
	 * The signature that triggered this alert didn't tie to a transaction, so the transaction (and metadata) logged is a forced estimation and may not be the one you expect
	 */
	tx_guessed?: boolean;
	tx_id?: number;
	verdict?: VerdictType;
	vlan?: [number, ...number[]];
	websocket?: WebsocketEvent;
}
export interface DnsSoa {
	expire?: number;
	minimum?: number;
	mname?: string;
	/**
	 * Set to true if the mname was too long and truncated by Suricata
	 */
	mname_truncated?: boolean;
	refresh?: number;
	retry?: number;
	rname?: string;
	serial?: number;
}
export interface VerdictType {
	action?: string;
	reject?: (('icmp-prohib' | 'tcp-reset') & string)[];
	reject_target?: ('to_client' | 'to_server' | 'both') & string;
}
export interface StatsApplayerError {
	/**
	 * Number of errors allocating memory
	 */
	alloc?: number;
	/**
	 * How many times app-layer error exception policy was applied, and which one
	 */
	exception_policy?: {
		bypass?: number;
		drop_flow?: number;
		drop_packet?: number;
		pass_flow?: number;
		pass_packet?: number;
		reject?: number;
		reject_both?: number;
	};
	/**
	 * Number of errors processing gaps
	 */
	gap?: number;
	/**
	 * Number of internal parser errors
	 */
	internal?: number;
	/**
	 * Number of errors reported by parser
	 */
	parser?: number;
}
